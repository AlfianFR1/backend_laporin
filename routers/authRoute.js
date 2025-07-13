const express = require('express');
const {loginWithGoogle, getAllUsers} = require('../controllers/authController');
const firebaseAuth = require('../middlewares/firebaseAuth');



module.exports = (router)=>{
// POST /auth/google
router.post('/auth/login', loginWithGoogle);
router.get('/users', firebaseAuth, getAllUsers)
}
