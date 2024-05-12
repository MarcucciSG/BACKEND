const { EErrors } = require("../Service/errors/enums.js");

const manejadorError = (error, req, res, next) => {
  console.log(error.causa);
  switch (error.code) {
    case EErrors.TIPO_INVALIDO:
      res.send({ status: "error", error: error.name });
      break;
  }
};

module.exports = manejadorError;
