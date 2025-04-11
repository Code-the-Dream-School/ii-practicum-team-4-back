const Box = require('../models/Box');
const { StatusCodes } = require('http-status-codes');

const getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find({});
    res.status(StatusCodes.OK).json({ boxes });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const createBox = async (req, res) => {
  try {
    const { name, weight, price } = req.body;
    if (!name || !weight || !price) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name, weight and price are required' });
    }
    const box = await Box.create({ name, weight, price });
    res.status(StatusCodes.CREATED).json({ box });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const updateBox = async (req, res) => {
  try {
    const {id} = req.params;
    const {name, weight, price} = req.body;
    const box = await Box.findByIdAndUpdate(id, {name, weight, price}, {new: true, runValidators: true});
    if (!box) {
      return res.status(StatusCodes.NOT_FOUND).json({error: 'Box not found'});
    }
    res.status(StatusCodes.OK).json({box});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
  }
}

const deleteBox = async (req, res) => {
  try {
    const {id} = req.params;
    const box = await Box.findByIdAndDelete(id);
    if (!box) {
      return res.status(StatusCodes.NOT_FOUND).json({error: 'Box not found'});
    }
    res.status(StatusCodes.OK).json({msg: 'Box deleted successfully'});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
  }
}

module.exports = {
  getAllBoxes,
  createBox,
  updateBox,
  deleteBox
}
