const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
    try{
        const user = await User.create(req.body);
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({user:{name: user.name }, token})
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({error: err.message})
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email||!password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email});
    if (!user) {
        throw new UnauthenticatedError('Email or password is incorrect');
    };

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new UnauthenticatedError('Email or password is incorrect');
    };

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {name: user.name}, token,
    })
};

const getCurrentUser = async (res, req) => {
    res.status(StatusCodes.OK).json({user: req.user});
}

module.exports = {
    register,
    login,
    getCurrentUser
}