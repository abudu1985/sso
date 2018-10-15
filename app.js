/**
 * Created by user on 11/10/18.
 */
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');
const checkjwtRoutes = require('./api/routes/checkjwt');

if(process.env.NODE_ENV === 'test') {
  mongoose.connect("mongodb://127.0.0.1/new",{ useNewUrlParser: true }
  );
} else {
  mongoose.connect("mongodb://igor:" + process.env.MONGO_ATLAS_PW + "@node-rest-shard-00-00-xjwsw.mongodb.net:27017,node-rest-shard-00-01-xjwsw.mongodb.net:27017,node-rest-shard-00-02-xjwsw.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true }
  );
}

mongoose.set('useCreateIndex', true);
// it for test
// app.use((req, res, next) => {
//   res.status(200).json({
//     message: 'It works'
//   })
// });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/checkjwt', checkjwtRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;