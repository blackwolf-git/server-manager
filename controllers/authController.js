const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const config = require('../config/config');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    try {
        // التحقق من صحة البيانات
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { full_name, phone_number, email, password } = req.body;

        // التحقق من وجود المستخدم مسبقاً
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ email }, { phone_number }] }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or phone'
            });
        }

        // إنشاء المستخدم
        const user = await User.create({
            full_name,
            phone_number,
            email,
            password_hash: password
        });

        // إنشاء JWT token
        const token = jwt.sign({ id: user.id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email
                },
                token
            },
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // إنشاء JWT token
        const token = jwt.sign({ id: user.id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email
                },
                token
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'full_name', 'email', 'phone_number', 'created_at']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};
