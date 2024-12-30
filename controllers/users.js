const { response, request } = require("express");

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

const postUser = (req, res) => {
  const { name, age } = req.body;

  res.status(201).json({
    msg: "POST API - Controller",
    name,
    age
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
