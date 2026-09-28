const { getDatabase } = require('./src/config/database');

async function cleanSampleData() {
  try {
    const db = await getDatabase();
    await db.run("DELETE FROM messages WHERE sender_name IN ('System', 'Alice', 'Bob', 'Tester') OR id = 'welcome_msg_1'");
    await db.run("DELETE FROM users WHERE username IN ('System', 'Alice', 'Bob', 'Tester', 'AliceAuth') OR id = 'system_bot_id'");
    console.log('Sample dummy chats and users removed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning database:', err);
    process.exit(1);
  }
}

cleanSampleData();
