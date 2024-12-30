const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersPath = '/api/users';

    // Middlewares
    this.middlewares();

    // Routes of my application
    this.routes();    
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Parse and read body
    this.app.use(express.json());

    // Public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usersPath, require('../routes/users'));
  }

  listen() {
    this.app.get("/", (req, res) => {
      res.send("Hello World");
    });

    this.app.listen(this.port, () => {
      console.log("Server is running on port " + process.env.PORT);
    });
  }
}

module.exports = Server;
