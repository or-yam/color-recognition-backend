const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const entries = require('./controllers/entries');
const userid = require('./controllers/userid');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = express();

app.use(express.json());
app.use(cors());

db.select('*')
  .from('users')
  .then((data) => {});

app.get('/', (req, res) => {
  res.send('this is working');
});
app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.put('/image', (req, res) => {
  entries.handleEntries(req, res, db);
});
app.post('/imageurl', (req, res) => {
  entries.handleApiCall(req, res);
});
app.get('/profile/:id', (req, res) => {
  userid.handleUserId(req, res, db);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
