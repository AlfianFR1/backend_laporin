const { admin } = require('../config/firebase'); // ⬅️ DESTRUCTURING


exports.sendToToken = async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'token, title, dan body wajib diisi' });
  }

  const message = {
    notification: { title, body },
    token,
    data: data || {},
  };

  try {
    const response = await admin.messaging().send(message); // ✅ ini valid
    console.log('✅ Notifikasi terkirim:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Gagal kirim notifikasi:', error);
    res.status(500).json({ error: error.message });
  }
};

// Kirim notifikasi ke topik
exports.sendToTopic = async (req, res) => {
  const { topic, title, body, data } = req.body;

  if (!topic || !title || !body) {
    return res.status(400).json({ error: 'topic, title, dan body wajib diisi' });
  }

  const message = {
    notification: { title, body },
    topic,
    data: data || {},
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notifikasi ke topik terkirim:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Gagal kirim notifikasi:', error);
    res.status(500).json({ error: error.message });
  }
};
