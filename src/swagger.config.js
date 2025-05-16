require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farm2You API',
      version: '1.0.0',
      description: 'API documentation for the Farm2You application',
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
     components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Address: {
          type: 'object',
          required: ['first_name', 'phone', 'address'],
          properties: {
            first_name: {
              type: 'string',
              example: 'Eva',
            },
            last_name: {
              type: 'string',
              example: 'Done',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'eva@example.com',
            },
            address: {
              type: 'string',
              example: '123 First St',
            },
            additional_info: {
              type: 'string',
              example: 'Ring the bell',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              example: '682525a5a6e051f98c6c00d0',
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              example: 'Eva Done',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'eva@example.com',
            },
            password: {
              type: 'string',
              minLength: 7,
              example: 'password123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
          Box: {
            type: 'object',
            required: ['name', 'weight', 'price'],
            properties: {
              _id: { type: 'string', example: '66541b7c1133e5f2c0001234' },
              name: { type: 'string', example: 'Large Box', maxLength: 100 },
              weight: { type: 'number', example: 12 },
              price: { type: 'number', example: 15 },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
