const express = require('express');
const authController = require('../app/controllers/authController');
const auth = require('../middleware/auth');


const router = express.Router();

//@route GET auth/refresh
//@desc Refresh token
//@access public
router.post('/token', authController.refreshAccessToken);

//@route POST auth/register/user
//@desc Register user
//@access public
router.post('/register/user', authController.userRegister);

//@route POST auth/login
//@desc Login user
//@access public
router.post('/login', authController.login);

//@route POST auth/logout
//@desc Logout user
//@access public
router.post('/logout', authController.logout);

module.exports = router;
