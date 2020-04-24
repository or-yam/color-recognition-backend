const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '12',
      name: 'john',
      email: 'john@gmail.com',
      password: '1234',
      entries: 7,
      joined: new Date(),
    },
    {
      id: '2',
      name: 'sally',
      email: 'sally@gmail.com',
      password: '4321',
      entries: 0,
      joined: new Date(),
    },
  ],
};

// Check server is working
app.get('/', (req, res) => {
  res.send(database.users);
});

//Sign in post request
app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('check your email or password');
  }
});
//Register Post request
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: '99',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

//Get user id and check for it on the data base
app.get('/profile/:id', (req, res) => {
  const { id } = req.params; // getting id. Try to change to map function instead forEach Convert to a global function
  let foundUser = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      foundUser = true;
      return res.json(user);
    }
  });
  if (!foundUser) {
    res.status(400).json('did not found user id');
  }
});
//adding to entries score
app.put('/image', (req, res) => {
  const { id } = req.body; //same as above Convert to a global function
  let foundUser = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      foundUser = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!foundUser) {
    res.status(400).json('did not found user id');
  }
});

app.listen(3001, () => {
  console.log('app is running on port 3001');
});
