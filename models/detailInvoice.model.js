const { Schema, model } = require("mongoose");

const DetailInvoiceSchema = Schema({
 
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  invoice: {
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  productUnit: {
    type: Number,
    default: 0,
  },
  
  precioTotal: {
    type: Number,
    default: 0,
  },

});

DetailInvoiceSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("DetailInvoice", DetailInvoiceSchema);