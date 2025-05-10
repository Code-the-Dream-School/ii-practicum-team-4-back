const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please type a name']
    },
    last_name: String,
    phone: {
        type: String,
        required: [true, 'Please enter a phone number']
    },
    email: {
      type: String,
      match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    additional_info: String,
  }, { _id: false });
  
  const UserProfileSchema = new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
      },
      addresses: [AddressSchema]
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('UserProfile', UserProfileSchema);