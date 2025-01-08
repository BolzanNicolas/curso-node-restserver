const response = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password are not correct - password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    return res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Contact the administrator",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, picture, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      // Create user
      const data = {
        name,
        email,
        image: picture,
        email,
        password: ":P",
        google: true
      };

      user = new User(data);
      await user.save();
    }

    // If user is deleted
    if(!user.state) {
      return res.status(401).json({
        msg: 'Please contact the administrator, user is blocked'
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      id_token,
    });
  } catch (error) {
    res.status(400).json({
      error: "Token could not be verified",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
