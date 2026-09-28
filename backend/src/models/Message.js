const { getDatabase, isMongoConnected } = require('../config/database');
const User = require('./User');
const MessageModel = require('./mongo/MessageModel');

class Message {
  static async create({ senderId, senderName, receiverId = null, text, status = 'sent' }) {
    await getDatabase();

    // Ensure sender exists in users
    let existingUser = await User.findById(senderId);
    let finalSenderId = senderId;

    if (!existingUser) {
      const user = await User.findOrCreate(senderName || 'Anonymous');
      finalSenderId = user.id;
    }

    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const timestamp = new Date().toISOString();

    if (isMongoConnected()) {
      const msgDoc = await MessageModel.create({
        id,
        sender_id: finalSenderId,
        sender_name: senderName,
        receiver_id: receiverId,
        text,
        timestamp: new Date(timestamp),
        status
      });

      const obj = msgDoc.toObject();
      delete obj._id;
      delete obj.__v;
      return {
        ...obj,
        timestamp: obj.timestamp.toISOString()
      };
    }

    // SQLite Fallback
    const db = await getDatabase();
    await db.run(
      `INSERT INTO messages (id, sender_id, sender_name, receiver_id, text, timestamp, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, finalSenderId, senderName, receiverId, text, timestamp, status]
    );

    return {
      id,
      sender_id: finalSenderId,
      sender_name: senderName,
      receiver_id: receiverId,
      text,
      timestamp,
      status
    };
  }

  static async getHistory({ limit = 50, offset = 0, receiverId = null } = {}) {
    await getDatabase();

    if (isMongoConnected()) {
      let filter = {};
      if (receiverId) {
        filter = { $or: [{ receiver_id: receiverId }, { receiver_id: null }] };
      }

      const msgs = await MessageModel.find(filter)
        .sort({ timestamp: 1 })
        .skip(parseInt(offset, 10))
        .limit(parseInt(limit, 10))
        .select('-_id -__v')
        .lean();

      return msgs.map(m => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
      }));
    }

    // SQLite Fallback
    const db = await getDatabase();
    let query = 'SELECT * FROM messages';
    const params = [];

    if (receiverId) {
      query += ' WHERE receiver_id = ? OR receiver_id IS NULL';
      params.push(receiverId);
    }

    query += ' ORDER BY timestamp ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    return await db.all(query, params);
  }

  static async markAsRead(messageIds) {
    if (!messageIds || messageIds.length === 0) return;
    await getDatabase();

    if (isMongoConnected()) {
      await MessageModel.updateMany(
        { id: { $in: messageIds } },
        { status: 'read' }
      );
      return;
    }

    // SQLite Fallback
    const db = await getDatabase();
    const placeholders = messageIds.map(() => '?').join(',');
    await db.run(
      `UPDATE messages SET status = 'read' WHERE id IN (${placeholders})`,
      messageIds
    );
  }

  static async markAllAsReadForUser(receiverId, senderId) {
    await getDatabase();

    if (isMongoConnected()) {
      await MessageModel.updateMany(
        {
          sender_id: senderId,
          $or: [{ receiver_id: receiverId }, { receiver_id: null }],
          status: { $ne: 'read' }
        },
        { status: 'read' }
      );
      return;
    }

    // SQLite Fallback
    const db = await getDatabase();
    await db.run(
      `UPDATE messages SET status = 'read' WHERE sender_id = ? AND (receiver_id = ? OR receiver_id IS NULL) AND status != 'read'`,
      [senderId, receiverId]
    );
  }

  static async clearChat({ userId1, userId2, targetId }) {
    await getDatabase();

    if (isMongoConnected()) {
      if (targetId === 'vedaz_company' || targetId === 'public' || (targetId && targetId.startsWith('grp_'))) {
        await MessageModel.deleteMany({ receiver_id: targetId });
      } else if (userId1 && userId2) {
        await MessageModel.deleteMany({
          $or: [
            { sender_id: userId1, receiver_id: userId2 },
            { sender_id: userId2, receiver_id: userId1 }
          ]
        });
      } else if (targetId) {
        await MessageModel.deleteMany({
          $or: [{ sender_id: targetId }, { receiver_id: targetId }]
        });
      }
      return;
    }

    // SQLite Fallback
    const db = await getDatabase();
    if (targetId === 'vedaz_company' || targetId === 'public' || (targetId && targetId.startsWith('grp_'))) {
      await db.run('DELETE FROM messages WHERE receiver_id = ?', [targetId]);
    } else if (userId1 && userId2) {
      await db.run(
        `DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
        [userId1, userId2, userId2, userId1]
      );
    } else if (targetId) {
      await db.run(
        `DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?`,
        [targetId, targetId]
      );
    }
  }
}

module.exports = Message;
