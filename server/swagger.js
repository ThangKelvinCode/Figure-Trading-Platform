import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Accessories Buying And Blindbox Trading',
    description: 'API documentation for the Accessories Buying and Blindbox Trading Platform',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'SP25_SWD_SWAGGER',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);