const express = require("express");

require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT;


const database = require("./config/database");
database.connect();

const routeClient = require("./routes/client/index.route");

 // Tất cả tên miền được phép truy cập vào
app.use(cors());
// Cho phép 1 tên miền cụ thể được phép truy cập
// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// }
// cors(corsOptions); // cho phep ten mien nay truy cap vao tat ca api

// parse application/json
app.use(bodyParser.json());

routeClient(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});