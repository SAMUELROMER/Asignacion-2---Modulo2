// Importar la biblioteca Mongoose para conectarse a una base de datos MongoDB
const { Schema, model } = require("mongoose");

// Definir el esquema de la factura
const EsquemaFactura = Schema({
  
  // Campo para el ID del usuario que realizó la compra
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario", // Referencia al modelo de usuario
    required: true,
  },
  // Campo para el estado de la factura (true = activa, false = cancelada)
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  // Campo para el total de la compra
  total: {
    type: Number,
    default: 0,
  },
  // Campo para la fecha de compra (por defecto es la fecha actual)
  fechaCompra: {
    type: Date,
    default: Date.now,
  },

});

// Definir el método toJSON() para el esquema de la factura
EsquemaFactura.methods.obtenerDatosJSON = function () {
  const { __v, estado, ...data } = this.toObject(); // Extraer todos los campos excepto __v y estado
  return data; // Devolver el objeto JSON con los datos de la factura
};

// Exportar el modelo de factura para poder utilizarlo en otras partes de la aplicación
module.exports = model("invoice", EsquemaFactura);