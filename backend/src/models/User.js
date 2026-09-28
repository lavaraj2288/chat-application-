const { getDatabase, isMongoConnected } = require('../config/database');
const bcrypt = require('bcryptjs');
const UserModel = require('./mongo/UserModel');
const MessageModel = require('./mongo/MessageModel');

const AVATAR_COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1'
];

function getRandomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

class User {
  // Register a new user with Email, Phone, Username, Password
  static async register({ username, email, phone, password }) {
    await getDatabase();
    const cleanUsername = username ? username.trim() : (email ? email.split('@')[0] : 'User_' + Math.floor(Math.random() * 1000));
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.trim() : null;

    if (isMongoConnected()) {
      if (cleanEmail) {
        const existingEmail = await UserModel.findOne({ email: cleanEmail });
        if (existingEmail) throw new Error('Email is already registered');
      }
      if (cleanPhone) {
        const existingPhone = await UserModel.findOne({ phone: cleanPhone });
        if (existingPhone) throw new Error('Mobile number is already registered');
      }
      const existingUser = await UserModel.findOne({ username: new RegExp('^' + cleanUsername + '$', 'i') });
      if (existingUser) throw new Error('Username is already taken');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const color = getRandomColor();

      const userDoc = await UserModel.create({
        id,
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        password_hash: passwordHash,
        avatar_color: color,
        status: 'online',
        last_seen: new Date(),
        created_at: new Date()
      });

      const obj = userDoc.toObject();
      delete obj.password_hash;
      delete obj.reset_otp;
      delete obj.reset_expires;
      delete obj._id;
      delete obj.__v;
      return obj;
    }

    // SQLite Fallback
    const db = await getDatabase();
    if (cleanEmail) {
      const existingEmail = await db.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (existingEmail) throw new Error('Email is already registered');
    }
    if (cleanPhone) {
      const existingPhone = await db.get('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
      if (existingPhone) throw new Error('Mobile number is already registered');
    }
    const existingUser = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [cleanUsername]);
    if (existingUser) throw new Error('Username is already taken');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const color = getRandomColor();

    await db.run(
      `INSERT INTO users (id, username, email, phone, password_hash, avatar_color, status, last_seen)
       VALUES (?, ?, ?, ?, ?, ?, 'online', CURRENT_TIMESTAMP)`,
      [id, cleanUsername, cleanEmail, cleanPhone, passwordHash, color]
    );

    return await db.get('SELECT id, username, email, phone, avatar_color, status, last_seen FROM users WHERE id = ?', [id]);
  }

  // Login with Email OR Mobile Number OR Username + Password
  static async login({ identifier, password }) {
    await getDatabase();
    const clean = identifier.trim().toLowerCase();

    if (isMongoConnected()) {
      const user = await UserModel.findOne({
        $or: [
          { email: clean },
          { phone: identifier.trim() },
          { username: new RegExp('^' + clean + '$', 'i') }
        ]
      });

      if (!user) throw new Error('User not found. Please check your email or mobile number.');

      if (!user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(password, salt);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) throw new Error('Invalid password. Please try again.');

      user.status = 'online';
      user.last_seen = new Date();
      await user.save();

      const obj = user.toObject();
      delete obj.password_hash;
      delete obj.reset_otp;
      delete obj.reset_expires;
      delete obj._id;
      delete obj.__v;
      return obj;
    }

    // SQLite Fallback
    const db = await getDatabase();
    const user = await db.get(
      `SELECT * FROM users WHERE LOWER(email) = ? OR phone = ? OR LOWER(username) = ?`,
      [clean, identifier.trim(), clean]
    );

    if (!user) throw new Error('User not found. Please check your email or mobile number.');

    if (!user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
      await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [user.password_hash, user.id]);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid password. Please try again.');

    await db.run(`UPDATE users SET status = 'online', last_seen = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);

    delete user.password_hash;
    delete user.reset_otp;
    delete user.reset_expires;
    return user;
  }

  // Generate 6-digit OTP for Forgot Password
  static async generateResetOtp(identifier) {
    await getDatabase();
    const clean = identifier.trim().toLowerCase();

    if (isMongoConnected()) {
      const user = await UserModel.findOne({
        $or: [
          { email: clean },
          { phone: identifier.trim() },
          { username: new RegExp('^' + clean + '$', 'i') }
        ]
      });

      if (!user) throw new Error('No account found with this email or mobile number.');

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      user.reset_otp = otp;
      user.reset_expires = expires;
      await user.save();

      return {
        otp,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone
        }
      };
    }

    // SQLite Fallback
    const db = await getDatabase();
    const user = await db.get(
      `SELECT * FROM users WHERE LOWER(email) = ? OR phone = ? OR LOWER(username) = ?`,
      [clean, identifier.trim(), clean]
    );

    if (!user) throw new Error('No account found with this email or mobile number.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await db.run(
      `UPDATE users SET reset_otp = ?, reset_expires = ? WHERE id = ?`,
      [otp, expires, user.id]
    );

    return {
      otp,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    };
  }

  // Reset password using OTP
  static async resetPassword({ identifier, otp, newPassword }) {
    await getDatabase();
    const clean = identifier.trim().toLowerCase();

    if (isMongoConnected()) {
      const user = await UserModel.findOne({
        $or: [
          { email: clean },
          { phone: identifier.trim() },
          { username: new RegExp('^' + clean + '$', 'i') }
        ]
      });

      if (!user) throw new Error('User account not found.');
      if (!user.reset_otp || user.reset_otp !== otp.trim()) {
        throw new Error('Invalid OTP code. Please check and try again.');
      }
      if (new Date(user.reset_expires) < new Date()) {
        throw new Error('OTP has expired. Please request a new one.');
      }

      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
      user.reset_otp = null;
      user.reset_expires = null;
      await user.save();

      return { success: true, message: 'Password has been reset successfully.' };
    }

    // SQLite Fallback
    const db = await getDatabase();
    const user = await db.get(
      `SELECT * FROM users WHERE LOWER(email) = ? OR phone = ? OR LOWER(username) = ?`,
      [clean, identifier.trim(), clean]
    );

    if (!user) throw new Error('User account not found.');
    if (!user.reset_otp || user.reset_otp !== otp.trim()) throw new Error('Invalid OTP code. Please check and try again.');
    if (new Date(user.reset_expires) < new Date()) throw new Error('OTP has expired. Please request a new one.');

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db.run(
      `UPDATE users SET password_hash = ?, reset_otp = NULL, reset_expires = NULL WHERE id = ?`,
      [newHash, user.id]
    );

    return { success: true, message: 'Password has been reset successfully.' };
  }

  static async findOrCreate(username) {
    await getDatabase();
    const cleanUsername = username.trim();

    if (isMongoConnected()) {
      let user = await UserModel.findOne({ username: new RegExp('^' + cleanUsername + '$', 'i') });
      if (!user) {
        const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const color = getRandomColor();
        user = await UserModel.create({
          id,
          username: cleanUsername,
          avatar_color: color,
          status: 'online',
          last_seen: new Date()
        });
      } else {
        user.status = 'online';
        user.last_seen = new Date();
        await user.save();
      }
      const obj = user.toObject();
      delete obj.password_hash;
      delete obj._id;
      delete obj.__v;
      return obj;
    }

    // SQLite Fallback
    const db = await getDatabase();
    let user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [cleanUsername]);
    if (!user) {
      const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const color = getRandomColor();
      await db.run(
        `INSERT INTO users (id, username, avatar_color, status, last_seen) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [id, cleanUsername, color, 'online']
      );
      user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    } else {
      await db.run(
        `UPDATE users SET status = 'online', last_seen = CURRENT_TIMESTAMP WHERE id = ?`,
        [user.id]
      );
      user.status = 'online';
    }
    return user;
  }

  static async findById(id) {
    await getDatabase();
    if (isMongoConnected()) {
      return await UserModel.findOne({ id }).select('-password_hash -reset_otp -reset_expires -_id -__v').lean();
    }
    const db = await getDatabase();
    return await db.get('SELECT id, username, email, phone, avatar_color, status, last_seen FROM users WHERE id = ?', [id]);
  }

  static async updateStatus(id, status) {
    await getDatabase();
    if (isMongoConnected()) {
      return await UserModel.findOneAndUpdate(
        { id },
        { status, last_seen: new Date() },
        { new: true }
      ).select('-password_hash -reset_otp -reset_expires -_id -__v').lean();
    }
    const db = await getDatabase();
    await db.run(
      `UPDATE users SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
    return await this.findById(id);
  }

  static async createGroup({ name, memberIds = [], color = '#00A884' }) {
    await getDatabase();
    const id = 'grp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const memberCount = memberIds.length || 1;
    const status = `Group • ${memberCount} members`;

    if (isMongoConnected()) {
      await UserModel.create({
        id,
        username: name.trim(),
        avatar_color: color,
        status
      });
      return {
        id,
        username: name.trim(),
        avatar_color: color,
        status,
        isGroup: true,
        memberIds
      };
    }

    const db = await getDatabase();
    await db.run(
      `INSERT INTO users (id, username, avatar_color, status) VALUES (?, ?, ?, ?)`,
      [id, name.trim(), color, status]
    );

    return {
      id,
      username: name.trim(),
      avatar_color: color,
      status,
      isGroup: true,
      memberIds
    };
  }

  static async getAllUsers() {
    await getDatabase();

    if (isMongoConnected()) {
      const users = await UserModel.find().select('-password_hash -reset_otp -reset_expires -_id -__v').lean();
      const mapped = users.map((u) => {
        if (u.id === 'vedaz_company' || (u.id && u.id.startsWith('grp_'))) {
          return {
            ...u,
            isGroup: true,
            status: u.id === 'vedaz_company' ? 'Company Group (Everyone can chat)' : u.status
          };
        }
        return u;
      });

      const companyGroupIndex = mapped.findIndex(u => u.id === 'vedaz_company');
      if (companyGroupIndex > 0) {
        const [group] = mapped.splice(companyGroupIndex, 1);
        mapped.unshift(group);
      }
      return mapped;
    }

    // SQLite Fallback
    const db = await getDatabase();
    const rows = await db.all('SELECT id, username, email, phone, avatar_color, status, last_seen FROM users ORDER BY status DESC, username ASC');
    const mapped = rows.map((u) => {
      if (u.id === 'vedaz_company' || u.id.startsWith('grp_')) {
        return {
          ...u,
          isGroup: true,
          status: u.id === 'vedaz_company' ? 'Company Group (Everyone can chat)' : u.status
        };
      }
      return u;
    });
    
    const companyGroupIndex = mapped.findIndex(u => u.id === 'vedaz_company');
    if (companyGroupIndex > 0) {
      const [group] = mapped.splice(companyGroupIndex, 1);
      mapped.unshift(group);
    }
    return mapped;
  }

  static async deleteUser(id) {
    await getDatabase();
    if (!id || id === 'vedaz_company') return false;

    if (isMongoConnected()) {
      await MessageModel.deleteMany({ $or: [{ sender_id: id }, { receiver_id: id }] });
      await UserModel.deleteOne({ id });
      return true;
    }

    const db = await getDatabase();
    await db.run('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [id, id]);
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

module.exports = User;
