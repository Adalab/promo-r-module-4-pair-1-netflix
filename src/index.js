const express = require('express');
const cors = require('cors');
const movies = require('../web/src/data/movies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => { //ejecuta el servidor
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//END POINTS
//For us: end points are dynamic routes where we specify the access point when someone asks for something. "Come here and do whatever is defined  into the callback function"
server.get('/movies', (req, res) => {
  res.json(movies); // ti seems that we don't need to return a data structure with success true, as it is already defined in movies.json
})