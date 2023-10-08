const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5500;
app.use(cors());

const IssueRoute = require('./routes/issue');

mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err))

const logger = (req, res, next) => {
    console.log(`LOG:
        ${req.method} 
        ${req.url} 
        ${req.ip}
        ${req.body}`);
    next();
};
app.use('/',logger, IssueRoute);

app.listen(PORT, () => console.log("Server connected"));