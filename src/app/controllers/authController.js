const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const express = require('express');
const Shipper = require("../models/Shipper");
require('dotenv').config();

const refreshTokens = {};

const authController = {
    userRegister: async (req, res) => {
        try {
            let role = 'user';
            const { email, phone, } = req.body;
            if (!email || !req.body.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing email or password'
                });
            }
            let account = await Account.findOne({ email });
            if (account) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already taken'
                });
            }
            let isExitPhone = await User.findOne({ phone });
            if (isExitPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone already taken'
                });
            }
            if (!constants.isPhoneNumber(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is not valid'
                });
            }

            //All good
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            let state = constants.ACCOUNT_STATUS_ACTIVE;
            let newAccount = new Account({
                email,
                password: hashedPassword,
                role,
                status: state || constants.ACCOUNT_STATUS_ACTIVE,
            });
            newAccount = await newAccount.save();
            let newUser = await userService.createUser(req, res, newAccount._id);
            const { password, ...other } = newAccount._doc;
            if (newUser && newAccount) {
                return res.status(201).json({
                    success: true,
                    message: 'Register successfully',
                    user: newUser,
                    ...other,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    generateAccesstoken: async (account, user) => {
        const accessToken = jwt.sign({
            email: account.email,
            role: account.role,
            userId: user._id,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
        return accessToken;
    },

    generateRefreshToken: async (account, user) => {
        const refreshToken = jwt.sign(
            {
                role: account.role,
                email: account.email,
                userId: user._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '300h' }
        );
        return refreshToken;
    },

    refreshAccessToken: async (req, res) => {
        try {
            const refreshToken = req.body.token;
            if (!refreshToken || !refreshTokens.hasOwnProperty(refreshToken)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                const newAccessToken = jwt.sign({
                    email: decode.email,
                    role: decode.role,
                    userId: decode.userId
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' });

                return res.json({
                    success: true,
                    message: 'Refresh token successfully',
                    accessToken: newAccessToken
                });
            });

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            let user = null;
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({
                    success: false,
                    message: "Missing email or password"
                });
            }
            let account = await Account.findOne({ email: req.body.email });
            if (!account) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect email'
                });
            }
            if (account.status === constants.ACCOUNT_STATUS_DELETED) {
                return res.status(400).json({
                    success: false,
                    message: 'Account is deleted'
                });
            }
            if (account.status === constants.ACCOUNT_STATUS_PENDING) {
                return res.status(400).json({
                    success: false,
                    message: 'Account is pending'
                });
            }
            if (account.role === 'user' || account.role === 'admin')
                user = await User.findOne({ account: account });
            else if (account.role === 'restaurant')
                user = await Restaurant.findOne({ account: account });
            else if (account.role === 'shipper')
                user = await Shipper.findOne({ account: account });

            const isValidPassword = await bcrypt.compare(req.body.password, account.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Incrorrect password'
                });
            }
            //all good
            const { password, ...others } = account._doc;
            const accessToken = await authController.generateAccesstoken(account, user);
            const refreshToken = await authController.generateRefreshToken(account, user);
            refreshTokens[refreshToken] = refreshToken;
            return res.status(200).json({
                success: true,
                message: 'Login successfully',
                user: user,
                ...others,
                accessToken,
                refreshToken
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    logout: async (req, res) => {
        try {
            const refreshToken = req.body.token;
            if (!refreshToken || !refreshTokens.hasOwnProperty(refreshToken)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }
            delete refreshTokens[refreshToken];
            return res.status(200).json({
                success: true,
                message: 'Logout successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (status !== "active" && status !== "inactive" && status !== "deleted") {
                return res.status(400).json({
                    success: false,
                    message: 'Status is not valid',
                });
            }

            const account = await Account.findById(id);
            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found',
                });
            }
            account.status = status;
            await account.save();
            return res.json({
                success: true,
                message: 'Update status successfully',
                account,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (role !== "admin" && role !== "user" && role !== "restaurant" && role !== "shipper" && role !== "guest") {
                return res.status(400).json({
                    success: false,
                    message: 'Role is not valid',
                });
            }
            const account = await Account.findById(id);
            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found',
                });
            }
            account.role = role;
            await account.save();
            return res.json({
                success: true,
                message: 'Update role successfully',
                account,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
};

module.exports = authController;
