const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
    },
    delivery_address: {
      type: String,
      required: [true, 'Please provide delivery address'],
    },
    delivery_first_name: {
      type: String,
      required: [true, 'Please provide delivery first name'],
    },
    delivery_last_name: {
      type: String,
      required: [true, 'Please provide delivery last name'],
    },
    delivery_phone: {
      type: String,
    },
    delivery_email: {
      type: String,
      required: [true, 'Please provide delivery email'],
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },
    delivery_additional_info: {
      type: String,
      default: '',
    },
    boxes: [
      {
        box_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Box',
          required: [true, 'Please provide box ID'],
        },
        items: [
          {
            product_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: [true, 'Please provide product ID'],
            },
            weight: {
              type: Number,
              required: [true, 'Please provide weight of the product'],
              min: 1,
            },
          },
        ]
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalOrderPrice: {
      type: Number,
      min: 0,
    }
  },
  { timestamps: true }
)


module.exports = mongoose.model('Order', OrderSchema);
