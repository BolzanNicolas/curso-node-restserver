const { response, request } = require("express");
const User = require("../models/user");

const getUser = (req, res) => {
  const { q, key } = req.query;

  res.json({
    msg: "GET API - Controller",
    q,
    key
  });
};

const putUser = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "PUT API - Controller",
    id: id
  });
};

const postUser = async(req, res) => {
  const body = req.body;
  const user = new User(body);
  await user.save();

  res.status(201).json({
    user
  });
};

const deleteUser = (req, res) => {
  res.json({
    msg: "DELETE API - Controller",
  });
};

module.exports = {
  getUser, 
  putUser,
  postUser,
  deleteUser
};
