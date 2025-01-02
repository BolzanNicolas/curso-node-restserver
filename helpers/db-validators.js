const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async(role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} does not exist in the database`);
  }
};

const emailExists = async(email = "") => {
  const existsEmail = await User.findOne({ email });
  if(existsEmail) {
    throw new Error(`Email ${email} already exists`);
  }
}

const userExists = async(id = "") => {
  const existsUser = await User.findById(id);
  if(!existsUser) {
    throw new Error(`User with ID ${id} does not exist`);
  }
}

module.exports = {
  isValidRole,
  emailExists,
  userExists
}
