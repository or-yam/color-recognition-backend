const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: 'enter your clarifi API key',
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.COLOR_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to load form api'));
};
const handleEntries = (req, res, db) => {
  const { id } = req.body;
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
};
module.exports = {
  handleEntries: handleEntries,
  handleApiCall: handleApiCall,
};
