const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const getUsers = async(req, res) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User
      .find(query)
      .skip(Number(from))
      .limit(Number(limit))
  ])

  res.json({
    total,
    users
  });
};

const putUser = async(req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...user } = req.body;

  // TODO: - Validate against DB 
  if(password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
  }

  const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });

  res.json(userUpdated);
};

const postUser = async(req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save in DB
  await user.save();

  res.status(201).json(user);
};

const deleteUser = async(req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false, }, { new: true });
  const authUser  = req.user;

  res.json({ user, authUser });
};

module.exports = {
  getUsers, 
  putUser,
  postUser,
  deleteUser
};
