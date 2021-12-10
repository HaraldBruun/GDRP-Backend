const cors = require('cors')
const jsonServer = require('json-server')
const express = require('express')
const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { users } = require('./users.json')
require('dotenv').config()

app.use(cors())
app.options('*', cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(middlewares)

app.post('/login', (req, res) => {
  if (users.includes(req.body.username)) {
    if (authenticated(req.body.password)) {
      let payload = { subject: req.body.username }
      let token = jwt.sign(payload, process.env.secret, { expiresIn: 3600 })
      res.status(200).send({ token })
    } else {
      res.status(401).send('Unauthorized')
    }
  } else {
    res.status(401).send('Username not found')
  }
})

app.use((req, res, next) => {
  if (validToken(req, res)) {
    next()
  } else {
    res.sendStatus(401)
  }
})

app.use(router)

app.listen(3000, () => {
  console.log('JSON Server is running')
})

const validToken = (req) => {
  if (!req.headers.authorization) {
    return false
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') return false
  let payload
  try {
    payload = jwt.verify(token, process.env.secret)
  } catch (error) {
    console.log('Not verified')
  }
  if (!payload) return false

  return true
}

const authenticated = (password) => {
  var hashedPass = crypto
  .createHash("sha256")
  .update(password)
  .digest("hex");
  // Password given here is already hashed from frontend
  return hashedPass === process.env.password
}
