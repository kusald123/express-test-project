require('dotenv').config();
const http = require('http');
const connection = require('./configs/db.connection');
const app = require('./src/app');

const { PORT_NUMBER } = process.env;
const port = process.env.PORT || PORT_NUMBER;

connection.connect();

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
