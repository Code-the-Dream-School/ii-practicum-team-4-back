const {StatusCodes} =  require ('http-status-codes');
const {CustomAPIError} = require('../errors')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later',
    };

if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
};

if(err.code && err.code === 11000){
    customError.msg = `User with this ${Object.keys(err.keyValue)} exist, try another`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  };

  if(err.name === 'CastError'){
    customError.msg = `User with this: ${err.value} not found`
    customError.statusCode = StatusCodes.NOT_FOUND;
  };

  if (err instanceof CustomAPIError) {
      return res.status(err.statusCode).json({ msg: err.message })
    }

  return res.status(customError.statusCode).json({ msg: customError.msg});
}

module.exports = errorHandlerMiddleware;