const { default: mongoose } = require('mongoose');
const URL =
  'mongodb+srv://tienco201:12345@e-commerce.kseoucy.mongodb.net/?retryWrites=true&w=majority';

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
