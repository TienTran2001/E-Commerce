const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const appRouter = require('./routes');

const app = express();
const port = process.env.PORT || 8888;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();

appRouter(app);

app.listen(port, () => {
  console.log(`server running on the port: ${port}`);
});
