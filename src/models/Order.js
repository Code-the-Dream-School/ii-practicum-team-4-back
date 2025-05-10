const mongoose = require('mongoose');
const Box = require('./Box');

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

OrderSchema.statics.createOrderWithBoxes = async function (orderData, items) {
  const availableBoxes = await Box.find({}).sort({ weight: 1 });
  const boxes = [];

  while (items.length > 0) {
    const box = this._packItemsIntoBox(items, availableBoxes);
    boxes.push(box);
  }

  const totalOrderPrice = this._calculateTotalOrderPrice(boxes, availableBoxes);

  return this.create({
    ...orderData,
    boxes,
    totalOrderPrice
  });
};

OrderSchema.statics._packItemsIntoBox = function (items, availableBoxes) {
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  let biggestBox = availableBoxes.find(box => box.weight >= totalWeight) || availableBoxes[availableBoxes.length - 1];

  const box = {
    box_id: biggestBox._id,
    items: []
  };

  let boxLeftWeight = biggestBox.weight;
  while (boxLeftWeight > 0 && items.length > 0) {
    const item = items.shift();
    if (item.weight <= boxLeftWeight) {
      box.items.push(item);
      boxLeftWeight -= item.weight;
    } else {
      box.items.push({ product_id: item.product_id, weight: boxLeftWeight });
      items.unshift({ product_id: item.product_id, weight: item.weight - boxLeftWeight });
      break;
    }
  }

  return box;
};

OrderSchema.statics._calculateTotalOrderPrice = function (boxes, availableBoxes) {
  return boxes.reduce((total, box) => {
    const boxPrice = availableBoxes.find(b => b._id.toString() === box.box_id.toString()).price;
    return total + boxPrice;
  }, 0);
};

module.exports = mongoose.model('Order', OrderSchema);
