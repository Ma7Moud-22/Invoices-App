const express = require('express');
const path = require('path');
const app = express();

const data = require('./data.json');

app.get('/data', (req, res) => {
  res.send(data);
});

app.get('/card/:id', (req, res) => {
  res.send(data.find(card => card.id === req.params.id))
});

app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(5500, () => console.info(`App listening on port 5500`));