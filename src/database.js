const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://marcuccisantiago8:6DkBMXU3lAE3TPUU@cluster0.fehywwf.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion"));
