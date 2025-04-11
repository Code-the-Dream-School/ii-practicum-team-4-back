const Order = require('../models/Order');
const Box = require('../models/Box');
const { StatusCodes } = require('http-status-codes');

const getAllOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    const orders = await Order.find({ user_id } );
    res.status(StatusCodes.OK).json({ orders });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
    }
    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const createOrder = async (req, res) => {
  try {
    let {
      user_id,
      items,
      delivery_address,
      delivery_first_name,
      delivery_last_name,
      delivery_phone,
      delivery_email,
      delivery_additional_info
    } = req.body;
    if (!user_id || !items || items.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User ID and items are required' });
    }

    let totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    const availableBoxes = await Box.find({}).sort({ weight: 1 });

    let biggestBox = availableBoxes[availableBoxes.length - 1];
    const boxes = [];

    while (items.length > 0) {
      totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
      biggestBox = availableBoxes.filter(box => box.weight >= totalWeight)[0];
      if (!biggestBox) {
        biggestBox = availableBoxes[availableBoxes.length - 1];
      }

      const box = {
        box_id: biggestBox._id,
        items: []
      }

      let boxLeftWeight = biggestBox.weight;
      while (boxLeftWeight > 0 && items.length > 0) {
        const item = items.shift();
        if (item.weight <= boxLeftWeight) {
          box.items.push(item);
          boxLeftWeight -= item.weight;
        } else {
          box.items.push({product_id: item.product_id, weight: boxLeftWeight });
          items.unshift({product_id: item.product_id, weight: item.weight - boxLeftWeight });
          break;
        }
      }
      boxes.push(box);
    }
    const totalOrderPrice = boxes.reduce((total, box) => {
      const boxPrice = availableBoxes.find(b => b._id.toString() === box.box_id.toString()).price;
      return total + boxPrice;
    }, 0)
    const order = await Order.create({
      user_id,
      boxes,
      delivery_address,
      delivery_first_name,
      delivery_last_name,
      delivery_phone,
      delivery_email,
      delivery_additional_info,
      totalOrderPrice
    });
    return res.status(StatusCodes.CREATED).json({ order });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
    }
    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}


module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder
}
