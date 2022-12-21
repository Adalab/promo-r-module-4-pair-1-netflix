const express = require('express');
const cors = require('cors');
const movies = require('../web/src/data/movies.json');
const users = require('../web/src/data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//END POINTS
//For us: end points are dynamic routes where we specify the access point when someone asks for something. "Come here and do whatever is defined  into the callback function"
server.get('/movies', (req, res) => {
  res.json(movies); // ti seems that we don't need to return a data structure with success true, as it is already defined in movies.json
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
      userId: 'id_de_la_usuaria_encontrada',
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
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
