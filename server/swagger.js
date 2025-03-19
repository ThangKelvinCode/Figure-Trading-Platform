import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0', 
    title: 'REST API',
    description: ''   
  },
  servers: [
    {
      url: 'http://localhost:3000',   
      description: 'SP25_SWD_SWAGGER'
    },
  ]
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);
