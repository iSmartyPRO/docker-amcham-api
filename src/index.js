require('dotenv').config();
const controller = require("./controllers/pages")
const config = require("./config")
const bodyParser = require('body-parser');
const app = require("./app")

// Middleware для обработки JSON тела запроса
app.use(bodyParser.json())

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server is running on port ${port}`) })