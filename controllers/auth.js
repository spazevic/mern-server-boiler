require('dotenv').config()
let db = require('../models')
let router = require('express').Router()
let jwt = require('jsonwebtoken')

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  res.send('STUB POST /auth/login')
})

// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  db.User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      return res.status(409).send({ message: 'email in use' })
    }
    db.User.create(req.body)
    .then(newUser => {
      let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 120
      })

      res.send({token})
    })
    .catch(err => {
      console.log('error creating user', err)
      if (err.name == 'ValidationError') {
        res.status(412).send({ message: `validation error  ${err.message}` })
      } else {
        res.status(500).send({ message: 'error creating user' })
      }
    })
  })
  .catch(err => {
    console.log('error dude in post route', err)
    res.status(503).send({ message: 'Database or server error'})
  })
})

// NOTE: User should be logged in to access this route
router.get('/profile', (req, res) => {
  // The user is logged in, so req.user should have data!
  // TODO: Anything you want here!

  // NOTE: This is the user data from the time the token was issued
  // WARNING: If you update the user info those changes will not be reflected here
  // To avoid this, reissue a token when you update user data
  res.send({ message: 'Secret message for logged in people ONLY!' })
})

module.exports = router

//hi
