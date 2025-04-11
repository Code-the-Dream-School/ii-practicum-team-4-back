const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name of the box'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      unique: true,
    },
    weight: {
      type: Number,
      required: [true, 'Please provide weight of the box'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price of the box'],
      trim: true,
    },
  })

module.exports = mongoose.model('Box', BoxSchema);
