const express = require('express');
const {
  createComment,
  getCommentsByReport,
  updateComment,
  deleteComment,
} = require('../controllers/reportCommentController');

const firebaseAuth = require('../middlewares/firebaseAuth');

module.exports = (router) => {
  // Komentar untuk laporan tertentu
  router.get('/report/:reportId/comments', firebaseAuth, getCommentsByReport);
  router.post('/report/:reportId/comments', firebaseAuth, createComment);

  // Operasi update dan delete komentar tertentu
  router.put('/comments/:commentId', firebaseAuth, updateComment);
  router.delete('/comments/:commentId', firebaseAuth, deleteComment);
};
