const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/db');
console.log('DB_URL:', process.env.DB_URL); // Add this line

connectDB();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening to ${port}...`));
