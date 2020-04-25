const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
app.use(express.json());
app.use(cors());
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1qaz',
    database: 'color_reco_db',
  },
});

db.select('*')
  .from('users')
  .then((data) => {});

// Check server is working
app.get('/', (req, res) => {
  res.send(database.users);
});

//Sign in post request
app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to signin'));
      } else {
        res.status(400).json('wrong email or password');
      }
    })
    .catch((err) => res.status(400).json('wrong email or password'));
});
//Register Post request
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('Unable to register'));
});

//Get user id and check for it on the data base
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('did not found user id');
      }
    })
    .catch((err) => res.status(400).json('Error getting user'));
});

//adding to entries score
app.put('/image', (req, res) => {
  const { id } = req.body; //same as above Convert to a global function
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json('did not found user id');
      }
    })
    .catch((err) => res.status(400).json('could not update user rank'));
});

app.listen(3001, () => {
  console.log('app is running on port 3001');
});
