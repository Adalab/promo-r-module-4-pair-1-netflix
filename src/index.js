const express = require('express');
const cors = require('cors');
const movies = require('../web/src/data/movies.json');
const users = require('../web/src/data/users.json');
const Database = require('better-sqlite3');

const db = new Database('./src/db/database.db', {
  verbose: console.log,
});

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.set('view engine', 'ejs');

//END POINTS
//For us: end points are dynamic routes where we specify the access point when someone asks for something. "Come here and do whatever is defined  into the callback function"

server.get('/movies', (req, res) => {
  // ti seems that we don't need to return a data structure with success true, as it is already defined in movies.json
  const query = db.prepare('SELECT * FROM movies');
  const movies = query.all();
  console.log(movies);
  res.json(
    //reconstruímos el objeto de tal modo que devuelva algo similar a lo que devolvía con json a pincho
    {
      success: true,
      movies: movies,
    }
  );
});

server.post('/login', (req, res) => {
  // console.log(req);
  const userFound = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  if (userFound !== undefined) {
    res.json({
      success: true,
      userId: userFound.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});

server.get('/movie/:movieId', (req, res) => {
  console.log(req.params); //URL params
  const foundMovie = movies.movies.find(
    (movie) => movie.id === req.params.movieId
  );
  res.render('movie', foundMovie);
  // res.json(foundMovie)
});

server.post('/signup', (req, res) => {
  // console.log(req);
  // console.log(req.body);
  // console.log(req.body.email);
  // console.log(req.body.password);
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare('INSERT INTO users (email,password) VALUES (?,?)'); //dos datos variables
  const result = query.run(email, password);
  res.json({
    success: true,
    userId: result.lastInsertRowid, //para recoger el id del ultimo elemento insertado
  });
});

server.get('/user/movies', (req, res) => {
  console.log('USER ID');
  console.log(req.header('userId'));
  res.json({
    success: true,
    movies: [],
  });
});

//servidor estaticos
const staticServerPathWeb = 'src/public-react/';
// En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticImages = 'src/public-movies-images/';
server.use(express.static(staticImages));

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  //ejecuta el servidor
  console.log(`Server listening at http://localhost:${serverPort}`);
});
