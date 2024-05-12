const generarInfoError = (usuario) => {
    return `Los datos estan incompletos o son invalidos.
              Necesitamos recibir lo siguien:
              - Nombre String, pero recibimos ${usuario.nombre}
              - Apellido: String, pero recibimos ${usuario.apellido}
              - Email: String, pero recibimos ${usuario.email}`;
  };
  
  module.exports = {
    generarInfoError,
  };