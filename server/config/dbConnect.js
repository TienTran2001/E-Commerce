const { default: mongoose } = require('mongoose');
const URL = process.env.DB_URL_CONNECT;

const dbConnect = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongoose connected');
  } catch (error) {
    console.log('DB connection is failed');
    throw new Error(error);
  }
};

module.exports = dbConnect;
