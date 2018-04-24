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


loadDB();

function loadBooks() {
  client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if (!parseInt(result.rows[0].count)) {
        fs.readFile('./books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
            INSERT INTO
            books(title, author, isbn, image_url, description) VALUES
           ($1, $2, $3, $4, $5)
            `,
            [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
            );
          });
        });
      }
    });
}


function loadDB() {

  client.query(`
    CREATE TABLE IF NOT EXISTS
    books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author TEXT,
      isbn VARCHAR(50),
      image_url VARCHAR(200),
      description VARCHAR
    );`
  )
    .then(data => {
      loadBooks(data);
    })
    .catch(err => {
      console.error(err);
    });
}