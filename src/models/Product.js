const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name of the product'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['vegetables', 'fruits', 'greens'],
      trim: true,
      maxlength: [100, 'Category cannot be more than 100 characters'],
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
