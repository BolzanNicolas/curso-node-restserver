const { response } = require("express");
const { Product, Category } = require("../models");

const getProducts = async(req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true }

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product
      .find(query)
      .populate('user', 'name')
      .skip(Number(from))
      .limit(Number(limit))
  ])

  res.json({
    total,
    products
  });
};

const getProduct = async(req, res = response) => {
  const { id } = req.params;
  const product = await Product
    .findById(id)
    .populate('user', 'name');

  res.json(product);
}

const createProduct = async(req, res = response) => {
  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({ name });

  if(productDB) {
    return res.status(400).json({
      msg: `Product ${ name } already exists`
    });
  }

  const user = req.user._id;

  const { description, price, category } = req.body;
  
  // Generate data to save
  const data = {
    name,
    user,
    price,
    category,
    description
  }

  const product = new Product(data);

  // Save DB
  await product.save();

  res.status(201).json(product);
}

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const productUpdated = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(productUpdated);
}

const deleteProduct = async(req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, { status: false, }, { new: true });

  res.json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}