const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB_PASS = process.env.DB_PASS;
    const DB = process.env.DB_URL.replace('<password>', DB_PASS);

    const conn = await mongoose.connect(DB);
    console.log(`Mongodb connected on ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
