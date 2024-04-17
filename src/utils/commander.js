const {Command} = require("commander");
const program = new Command(); 

//Recuerden: 
//1 - Comando // 2 - La descriptción, // 3- Valor por default

program
    .option("--mode <mode>", "modo de trabajo", "desarrollo")
program.parse();
console.log("Opciones: ", program.opts());


module.exports = program;