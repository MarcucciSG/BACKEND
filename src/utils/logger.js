const winston = require("winston");
const configObject = require("../config/config.js");


const niveles = {
  nivel: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colores: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

//Logger para desarrollo:

const loggerDesarrollo = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

//Logger para producción:

const loggerProduccion = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
    }),
  ],
});

//Determinar que logger utilizar segun el entorno:

const logger =  "produccion" ? loggerProduccion : loggerDesarrollo;

//Creamos nuestro propio middleware donde vamos a usar este logger:
const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
module.exports = addLogger;
