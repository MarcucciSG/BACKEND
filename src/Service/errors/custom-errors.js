//Creamos una clase para crear errores propios
//Le fabricamos un metodo estatico para crear errores.
class CustomError{
    static createError(errorName,errorCause,errorMessage,errorDescription){
        const error = new Error(errorMessage)
        //Como es un objeto le puedo setear propiedades..
        error.name = errorName
        error.cause = errorCause
        error.description = errorDescription
        //Lanzamos el error el cual detiene la ejecucion
        //Recordar capturar el error con try/catch en otro modulo....
        throw error
    }
}


module.exports = CustomError;