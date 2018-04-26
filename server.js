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
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get('/', (request, response) => response.send('AWESOME BOOKS!'));

app.get('/api/v1/books', (request, response) => {
  client.query('SELECT * FROM books;')
    .then(results => response.send(results.rows))
    .catch( err => app.errorView.errorCallBack(err));
});

app.get('/api/v1/books/:id', (request, response) => {
  let key = `SELECT * FROM books WHERE id=$1`;
  let value = [request.params.id];
  client.query(key, value)
    .then( results => response.send(results.rows[0]) )
    .catch( err => app.errorView.errorCallBack(err));
});

app.post('/api/v1/books', (request, response) => {
  let key = `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;
  let value = [
    request.body.title,
    request.body.author,
    request.body.isbn,
    request.body.image_url,
    request.body.description];
  client.query(key, value)
    .then( () => response.send( 'New Book added to db'))
    .catch( err => app.errorView.errorCallBack(err));
});

app.put('/api/v1/books/update/single-book:id', (request, response) => {
  let key = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5 WHERE id=$6`;
  let values = [
    request.body.title,
    request.body.author,
    request.body.isbn,
    request.body.image_url,
    request.body.description,
    request.params.id
  ];
  client.query(key, values)
    .then(() => response.send('update completed'))
    .catch(err => app.errorView.errorCallBack(err));
});


app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

