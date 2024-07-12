const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/users', ensureAuthenticated, userController.users);
router.get('/user/:id', ensureAuthenticated, userController.find);
router.post('/users', ensureAuthenticated, userController.postData);
router.put('/user/:id', ensureAuthenticated, userController.PutInfo);
router.patch('/user/:id', ensureAuthenticated, userController.PatchInfo);
router.delete('/user/:id', ensureAuthenticated, userController.delete);


module.exports = router;
