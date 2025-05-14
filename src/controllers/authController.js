const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
    try{
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('User with this email already exists!');
        }
        const user = await User.create(req.body);
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({
            user:{name: user.name, user_id: user._id }, 
            token})
    } catch (err) {
        next (err);
    }
};

// @desc    Login user and return token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if (!email||!password) {
            return next(new BadRequestError('Please provide email and password')) ;
        }

        const user = await User.findOne({ email});
        if (!user) {
            return next  (new UnauthenticatedError('Email or password is incorrect'));
        };

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return next  (new UnauthenticatedError('Email or password is incorrect'));
        };

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            user: {name: user.name}, token,
        })
    } catch (err) {
        next(err);
    };
}

// @desc    Get currently authenticated user info
// @route   GET /api/v1/auth/current-user
// @access  Private
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('name email');
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
        }
        const token = user.createJWT();
        res.status(200).json({ user, token });
    } catch (err) {
        console.error('CURRENT USER ERROR:', err);
        next(err);
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
}