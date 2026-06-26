// config/swagger.js
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'E-commerce API', version: '1.0.0' },
    components: {
      securitySchemes: {
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      },
    },
    security: [{ cookieAuth: [] }],
  },

  apis: ['./routes/*.js'],
};

module.exports = swaggerOptions;
