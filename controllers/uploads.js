const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const upload = async(req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({ 
      msg: 'No files were uploaded.'
    });
  }

  try {
    // const name = await uploadFile(req.files, ['txt', 'md'], 'textos');
    const name = await uploadFile(req.files, undefined, 'imgs');
    res.json({ name });

  } catch (err) {
    res.status(400).json({ 
      msg: err 
    });
  }
}

const updateImage = async(req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `User with id ${id} does not exist`
        })
      }
      break;

    case 'products':
      model = await Product.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `Product with id ${id} does not exist`
        })
      }
      break;

    default: 
      return res.status(500).json({
        msg: `The collection '${collection}' is not implemented yet.`
      });
  }

  // // Clean previous images
  if(model.image) {
    const imagePath = path.join(__dirname, '../uploads', collection, model.image);
    if(fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  try {
    const image = await uploadFile(req.files, undefined, collection);
    model.image = image;
    await model.save();

    res.json(model);
  } catch (err) {
    res.status(400).json({
      msg: err
    });
  }
}
const updateImageCloudinary = async(req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `User with id ${id} does not exist`
        })
      }
      break;

    case 'products':
      model = await Product.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `Product with id ${id} does not exist`
        })
      }
      break;

    default: 
      return res.status(500).json({
        msg: `The collection '${collection}' is not implemented yet.`
      });
  }

  // // Clean previous images
  if(model.image) {
    const nameArr = model.image.split('/');
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.image = secure_url;
  await model.save()
  res.json(model);
}

const showImage = async(req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `User with id ${id} does not exist`
        })
      }
      break;

    case 'products':
      model = await Product.findById(id);
      if(!model) {
        return res.status(400).json({
          msg: `Product with id ${id} does not exist`
        })
      }
      break;

    default: 
      return res.status(500).json({
        msg: `The collection '${collection}' is not implemented yet.`
      });
  }

  // // Clean previous images
  if(model.image) {
    const imagePath = path.join(__dirname, '../uploads', collection, model.image);
    if(fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const noImage = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(noImage);
}

module.exports = {
  upload,
  updateImage,
  updateImageCloudinary,
  showImage
}