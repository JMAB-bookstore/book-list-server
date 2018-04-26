'use strict';

const cors = require('cors');
const pg = require('pg');
const express = require('express');
const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(express.json());
app.use(express.urlendcoded({extended:true}));
app.use(cors());

app.get('/', (request, response) => response.send('AWESOME BOOKS!'));

app.get('/api/v1/books', (request, response) => {
  client.query('SELECT * FROM books;')
    .then(results => response.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (request, response) => {
  let key = `SELECT * FROM books WHERE id=$1`;
  let value = [request.params.id];
  client.query(key, value)
    .then( results => response.send(results.rows[0]) ) // included 0 index
    .catch( console.error);
});



app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

