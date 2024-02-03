require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const mongoConnectionString = `mongodb://${process.env.DBUSERNAME}:${encodeURIComponent(process.env.DBPASSWORD)}@${process.env.DBHOST}/${process.env.DBDATABASENAME}?authSource=admin`;

mongoose.connect(mongoConnectionString);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB!'));

app.use(express.json());

const countriesRouter = require('./routes/countries');
app.use('/countries', countriesRouter);

const salesRepRouter = require('./routes/salesrep');
app.use('/salesrep', salesRepRouter);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));