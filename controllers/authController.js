
require('dotenv').config();
const { admin, db } = require('../config/firebase');

// const ADMIN_EMAIL = 'rohmanfatur.alfian@gmail.com'; // ⬅️ Bisa pindahkan ke ENV



const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  // console.log('Received token from Flutter:', req.body.idToken);

  
const ADMIN_EMAIL = process.env.AUTHFIREBASE_ADMINEMAIL;
  if (!idToken) {
    return res.status(400).json({ error: 'ID Token tidak ditemukan.' });
  }
  

  try {
    // 🔐 Verifikasi ID token dari Firebase Auth
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    // console.log('[DEBUG] private_key:', process.env.FIREBASE_PRIVATE_KEY.slice(0, 30)); // jangan log seluruhnya demi keamanan


    if (!email) {
      return res.status(400).json({ error: 'Email tidak valid di token.' });
    }

    // 🔎 Cek di Firestore apakah user sudah ada
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    let role = 'user';

    if (!userDoc.exists) {
      // 🆕 Buat user baru
      role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

      await userRef.set({
        uid,
        email,
        role,
        displayName: name || '',
        photoURL: picture || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ User baru dibuat: ${email} → ${role}`);
    } else {
      // 👤 User lama
      const data = userDoc.data();
      role = data?.role ?? 'user';
      console.log(`🔁 User login ulang: ${email} → ${role}`);
    }

    res.status(200).json({
      uid,
      email,
      role,
    });
  } catch (error) {
    console.error('❌ Gagal login dengan Google:', error?.message || error);
    return res.status(401).json({ error: 'ID Token tidak valid atau expired.' });
  }

};

// ✅ Fungsi baru: Ambil semua user
const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // res.status(200).json({
    //   status: true,
    //   message: 'Berhasil mengambil semua pengguna',
    //   data: users
    // });

    res.status(200).json({ message: 'Berhasil mengambil semua Users', data: users });
  } catch (error) {
    console.error('❌ Gagal mengambil semua user:', error.message);
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data user.',
      error: error.message,
    });
  }
};


module.exports = {
  loginWithGoogle,
  getAllUsers
};
