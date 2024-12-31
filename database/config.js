const mongoose = require('mongoose');

const dbConnection = async() => {
  try {
     await mongoose.connect(process.env.MONGODB_CNN, {
      useNewURLParser: true,
      useUnifiedTopology: true
     });

     console.log('Database online');

  } catch(error) {
    console.log(error);
    throw new Error('Error to connect to database');
  }
}

module.exports = {
  dbConnection
}