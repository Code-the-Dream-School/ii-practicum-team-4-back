const { jwtDecode } = require('jwt-decode');
const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');

const UserProfile = require('../models/UserProfile');

const getAllOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    const orders = await Order.find({ user_id } )
      .populate('boxes.items.product_id', 'name image price')
      .sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ orders });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate('boxes.items.product_id', 'name image price');
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
    const {
      items,
      delivery_address,
      delivery_first_name,
      delivery_last_name,
      delivery_phone,
      delivery_email,
      delivery_additional_info
    } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwtDecode(token);
    const { userId: user_id } = decoded;

    if (!user_id || !items || items.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User ID and items are required' });
    }

    const orderData = {
      user_id,
      delivery_address,
      delivery_first_name,
      delivery_last_name,
      delivery_phone,
      delivery_email,
      delivery_additional_info
    };

    //save Data into the UserProfile
    await UserProfile.findOneAndUpdate(
      {user_id},
      {
        $addToSet: {
          addresses: {
            first_name: delivery_first_name,
            last_name: delivery_last_name,
            phone: delivery_phone,
            email: delivery_email,
            address: delivery_address,
            additional_info: delivery_additional_info
          }
        }
      },
      {upsert: true,
       new: true
      }
    );

    const order = await Order.createOrderWithBoxes(orderData, items);
    return res.status(StatusCodes.CREATED).json({ order });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

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
