const { response, request } = require("express");
const { DetailInvoice, Product,Invoice } = require("../models");

const getDetailInvoice = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [detailinvoice, total] = await Promise.all([
   DetailInvoice.find(query)
      .populate("product", "name")
      .populate("invoice", "_id")
      .skip(from)
      .limit(limit),
    DetailInvoice.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    detailinvoice,
  });
};

const getDetailInvoiceById = async (req = request, res = response) => {
  const { id } = req.params;
  const detailInvoice = await DetailInvoice.findById(id)
    .populate("product", "name precio");
    
  if (!detailInvoice) {
    return res.status(404).json({ msg: `No detail invoice found with id ${id}` });
  }

  res.status(200).json(detailInvoice);
};

const createDetailInvoice = async (req, res = response) => {
  const { status,user,  product, invoice, productUnit, ...body } = req.body;
  const productDB = await Product.findById(product);

 const existingDetailInvoice = await DetailInvoice
  .findOne({ product, invoice })
  .populate('product', 'name');

  if (existingDetailInvoice) {
    return res.status(400).json({ msg: `The product ${existingDetailInvoice.product.name} is already in the invoice ${invoice}` });
  }

  if (!productDB)
    return res
      .status(400)
      .json({ msg: `the product  not already exists` });
  
  if (productUnit > 7) {
    return res.status(400).json({ msg: `The maximum number of units is 7` });
  }

  const precioTotal = productDB.precio * productUnit ;

  const detailInvoices = await DetailInvoice.find({ invoice });
  const distinctProducts = new Set(); // set para almacenar productos distintos
  let totalInvoice = 0; // variable para almacenar el total de la factura


  detailInvoices.forEach(detailInvoice => {
    distinctProducts.add(detailInvoice.product.toString());
    totalInvoice += detailInvoice.precioTotal; // sumar el precio total del producto a la factura
  });
  // verificar si el producto ya ha sido agregado previamente
  if (distinctProducts.has(product)) {
    return res.status(400).json({ msg: `The product ${product} has already been added to the invoice.` });
  }
  // Agregar el producto al set de productos distintos
  distinctProducts.add(product);

  // verificar que no se hayan agregado más de 10 productos distintos
  if (distinctProducts.size > 10) {
    return res.status(400).json({ msg: `Cannot add more than 10 distinct products to the invoice.` });
  }

  const data = {
    ...body,
    product, 
    invoice,
    user: req.user._id,
    productUnit,
    precioTotal,
  };

  const detailInvoice = new DetailInvoice(data);
  await detailInvoice.save();

   // Actualizar el total de la factura en la colección de Invoice
  const invoiceToUpdate = await Invoice.findById(invoice);
  invoiceToUpdate.total = totalInvoice + precioTotal;
  await invoiceToUpdate.save();

  res.status(200).json(detailInvoice);
};

const updateDetailInvoice = async (req, res) => {
  const { id } = req.params;
  const { status, user, product, invoice, productUnit, ...data } = req.body;
  const productDB = await Product.findById(product);

  const detailInvoice = await DetailInvoice.findById(id);
  if (!detailInvoice) {
    return res.status(404).json({ msg: `No existe el detalle de factura con el ID ${id}` });
  }

  const precioTotal = productDB.precio * productUnit ;
  // Actualizamos los datos del detalle de factura
  detailInvoice.status = status ?? detailInvoice.status;
  detailInvoice.user = user ?? detailInvoice.user;
  detailInvoice.product = product ?? detailInvoice.product;
  detailInvoice.invoice = invoice ?? detailInvoice.invoice;
  detailInvoice.productUnit = productUnit ?? detailInvoice.productUnit;
  detailInvoice.precioTotal = precioTotal;                           //data.precioTotal ?? detailInvoice.precioTotal;

  await detailInvoice.save();

  res.status(200).json(detailInvoice);
};

const deleteDetailInvoice = async (req, res) => {
  const { id } = req.params;

  const detailInvoice = await DetailInvoice.findById(id);
  if (!detailInvoice) {
    return res.status(404).json({ msg: `Detail invoice with ID ${id} does not exist.` });
  }

  await DetailInvoice.findByIdAndDelete(id);

  res.json({ msg: "Detail invoice deleted successfully." });
};


module.exports = {
  getDetailInvoice,
  getDetailInvoiceById,
  createDetailInvoice,
  updateDetailInvoice, 
  deleteDetailInvoice,
};
