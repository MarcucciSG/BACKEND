const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Dcoumentacion de la app Ecormerce",
        description:
          "app web para un Ecormerce",
      },
    },
    apis: ["./src/docs/**/*.yaml"],
  };

  const specs = swaggerJSDoc(swaggerOptions);

  module.exports = {
    swaggerOptions,
    specs
  }