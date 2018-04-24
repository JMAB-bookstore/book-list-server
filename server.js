'use strict';

const cors = require('cors');
const pg = require('pg');
const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (request, response) => response.send('AWESOME BOOKS!'));

app.get('/awesomebooks', (request, response) => {
  client.query('SELECT * FROM books;')
    .then(results => response.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

