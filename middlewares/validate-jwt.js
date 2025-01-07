const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const user = require('../models/user.js');

const validateJWT = async(req = request, res = response, next) => {
  const token = req.header('x-token');
  
  if(!token) {
    return res.status(401).json({
      msg: 'Token is required'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
  
    // Read uid user
    const user = await User.findById(uid);
    
    if(!user) {
      return res.status(401).json({
        msg: 'Invalid token - user not exists'
      })
    }

    // Verify user state
    if (!user.state) {
      return res.status(401).json({
        msg: 'Invalid token - user state: false'
      })
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      msg: 'Invalid token'
    });
  }
}

module.exports = { 
  validateJWT 
}