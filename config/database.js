const mongoose = require('mongoose');

const connectDB = async () => {
  let uri;
  if (process.env.NODE_ENV === 'test') {
    uri = process.env.TEST_MONGODB_URI;
  } else if (process.env.NODE_ENV === 'production') {
    uri = process.env.MONGODB_URI;
  } else {
    uri = process.env.DEV_MONGODB_URI;
  }

  const conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold,
    );
  }
};

module.exports = connectDB;
