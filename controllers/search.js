const { response } = require('express');
const { User, Category, Product } = require('../models');
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
  'categories',
  'users',
  'products',
  'roles'
];

const searchUsers = async(term = '', res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if(isMongoID) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const users = await User.find({ 
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }]
  });
  
  res.json({
    results: users ? users : []
  });
};

const searchCategories = async(term = '', res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if(isMongoID) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const categories = await Category.find({ 
    $or: [{ name: regex }],
    $and: [{ status: true }]
  });
  
  res.json({
    results: categories ? categories : []
  });
};

const searchProducts = async(term = '', res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if(isMongoID) {
    const product = await Product.findById(term).populate('category', 'name');
    return res.json({
      results: product ? [product] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const products = await Product.find({ 
    $or: [{ name: regex }, { description: regex }],
    $and: [{ status: true }]
  })
  .populate('category', 'name');
  
  res.json({
    results: products ? products : []
  });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if(!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are ${ allowedCollections }`
    });
  }

  switch (collection) {
    case 'categories':
      searchCategories(term, res);
      break;
    case 'users':
      searchUsers(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    case 'roles':
      break;
    default:
      res.status(500).json({
        msg: 'Search functionality for this collection is not implemented yet'
      });
  }
};

module.exports = {
  search
}