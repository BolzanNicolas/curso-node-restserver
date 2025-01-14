const {
  Role,
  User,
  Category,
  Product
} = require("../models");

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

const categoryExists = async(id = "") => {
  const existsCategory = await Category.findById(id);
  if(!existsCategory) {
    throw new Error(`Category with ID ${id} does not exist`);
  }
}

const productExists = async(id = "") => {
  const existsProduct = await Product.findById(id);
  if(!existsProduct) {
    throw new Error(`Product with ID ${id} does not exist`);
  }
}

module.exports = {
  isValidRole,
  emailExists,
  userExists,
  categoryExists,
  productExists
}
