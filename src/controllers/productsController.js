const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, category, image } = req.body;
    if (!name || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name and category are required' });
    }
    const product = await Product.create({ name, category, image });
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const {name, category, image} = req.body;
    const product = await Product.findByIdAndUpdate(id, {name, category, image}, {new: true, runValidators: true});
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({error: 'Product not found'});
    }
    res.status(StatusCodes.OK).json({product});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
  }
}

const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({error: 'Product not found'});
    }
    res.status(StatusCodes.OK).json({msg: 'Product deleted successfully'});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message});
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
}
