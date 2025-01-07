const { response } = require("express")

const isAdminRole = (req, res = response, next) => {
  if(!req.user) {
    return res.status(500).json({
      msg: 'Need to verify token before checking the role'
    })
  }

  const { role, name } = req.user;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} does not have administrator privileges - Access denied`
    })
  }
  next();
}

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if(!req.user) {
      return res.status(500).json({
        msg: 'Need to verify token before checking the role'
      })
    }
    
    if(!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `This service requires one of these roles: ${roles.join(', ')}`
      })
    }

    next();
  };
}

module.exports = {
  isAdminRole,
  hasRole
}