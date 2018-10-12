/**
 * Created by user on 11/10/18.
 */
const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Order.find()
    .select('productId quantity _id')
    .populate('productId', 'name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            quantity: doc.quantity,
            productId: doc.productId,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
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
  Product.findById(req.body.productId)
    .then(product => {
      if(!product){
        return res.status(404).json({message: "Product not find"});
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId, // use body-parser here
        quantity: req.body.quantity
      });
      console.log(order);
      return order.save()
    })
    .then(result =>{
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          productId: result.productId, // use body-parser here
          quantity: result.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then(order => {
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + order._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({_id: id})
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