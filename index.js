const express = require("express");
require('dotenv').config();
const app = express();
const port = 3000;


const databse = require("./config/database");
databse.connect();

const routeClient = require("./routes/client/index.route");

routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});