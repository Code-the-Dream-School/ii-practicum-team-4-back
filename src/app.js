const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter');
const authRouter = require('./routes/authRouter');
const productsRouter = require('./routes/productsRouter');

const notFound = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter)

//errors handler
app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;
