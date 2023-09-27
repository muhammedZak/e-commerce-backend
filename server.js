const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');
connectDB();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening to ${port}...`));
