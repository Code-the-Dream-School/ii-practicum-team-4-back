const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/authRouter');
const productsRouter = require('./routes/productsRouter');
const boxesRouter = require('./routes/boxesRouter');
const ordersRouter = require('./routes/ordersRouter');
const userProfileRouter = require('./routes/userProfileRouter');

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
app.use('/api/v1/boxes', boxesRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/profile', userProfileRouter);

//errors handler
app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;