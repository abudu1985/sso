/**
 * Created by user on 11/10/18.
 */
const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res, next) => {     // checkAuth,
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
       const response = {
         count: docs.length,
         products: docs.map(doc => {
           return {
             name: doc.name,
             price: doc.price,
             _id: doc._id,
             request: {
               type: 'GET',
               url: 'http://localhost:3000/products/' + doc._id
             }
           }
         })
       };
       res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
  // const product = {
  //   name: req.body.name,   // get data with help of body-parser package
  //   price: req.body.price
  // };
  const  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,    // get data with help of body-parser package
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling POST request to /products',
        product: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if(doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({message: 'No valid entry found'});
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

/**
 * update request should look like (as json)
 * [{"propName": "price", "value":1111},{"propName": "name", "value":"change name"}]
 *
 */
router.patch('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id},
    {$set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});


module.exports = router;