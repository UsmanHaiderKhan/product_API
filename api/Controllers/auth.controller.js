const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

module.exports = {
  // GET ALL :  Users Details

  getAllUsers: (req, res, next) => {
    Auth.find({})
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          users: docs.map((doc) => {
            return {
              _id: doc._id,
              email: doc.email,
              password: doc.password,

              request: {
                type: 'GET',
                url: 'http://localhost:3000/users/' + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  },

  // POST : Create New User

  createNewUser: (req, res, next) => {
    Auth.find({ email: req.body.email })
      .exec()
      .then((auth) => {
        if (auth.length >= 1) {
          return res.status(409).json({
            message: 'Email already Exist!!!',
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const auth = new Auth({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              auth
                .save()
                .then((result) => {
                  res.status(201).json({
                    message: 'User Has Been Created Successfully',
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err.message,
                  });
                });
            }
          });
        }
      });
  },

  // POST : Login

  loggedIn: (req, res, next) => {
    Auth.find({ email: req.body.email })
      .exec()
      .then((auth) => {
        if (auth.length < 1) {
          return res.status(401).json({
            message: 'Login Authorization Failed',
          });
        } else {
          bcrypt.compare(req.body.password, auth[0].password, (err, result) => {
            if (err) {
              return res.status(401).json({
                message: 'Authorization Failed',
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  email: auth[0].email,
                  userId: auth[0]._id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: '1h',
                }
              );
              return res.status(200).json({
                message: 'Token Authorization Successful',
                token: token,
              });
            }
            res.status(401).json({
              message: 'Token Authorization Failed',
            });
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        });
      });
  },

  // DELETE : User By Id

  deleteUser: (req, res, next) => {
    Auth.findByIdAndDelete({ _id: req.params.userId })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'User Has Been Deleted Successfully',
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        });
      });
  },
};
