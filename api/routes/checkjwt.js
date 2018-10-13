const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
     const valid = jwt.verify(token, process.env.JWT_KEY);
     if(valid){
       res.status(201).json({
         message: "Valid!"
       });
     }
  } catch(err) {
    console.log(err);
    res.status(500).json({error: err});
  }
});

module.exports = router;