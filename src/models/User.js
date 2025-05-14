const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//add UserProfile
const UserProfile = require('./UserProfile');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Please type your name'],
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'
        ],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 7,
    }
}, {timestamps: true});

//Hashing password if changed
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

//create empty UserProfile after user saved
userSchema.post('save', async function (doc, next){
    try{
        const existing = await UserProfile.findOne({ user_id: doc._id});
        if (!existing) {
            await UserProfile.create({ user_id: doc._id, addresses: []})
        }
        next();
    } catch (err) {
        console.error('Error creating UserProfile:', err);
        next(err);
    }
});

//create JWT
userSchema.methods.createJWT = function (){
    return jwt.sign (
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )
};

//compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', userSchema);