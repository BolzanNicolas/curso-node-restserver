const response = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verify existent email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password are not correct - email",
      });
    }

    // If user is active
    if (!user.state) {
      return res.status(400).json({
        msg: "User / Password are not correct - state: false",
      });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword ) {
      return res.status(400).json({
        msg: 'User / Password are not correct - password',
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    return res.json({
      user,
      token
    });
    
  } catch (error) {
    return res.status(500).json({
      msg: "Contact the administrator",
    });
  }
};

module.exports = {
  login,
};
