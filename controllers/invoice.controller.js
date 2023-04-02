//Se importa la librería express y el modelo Invoice desde la carpeta models.
const { response, request } = require("express");
const { Invoice } = require("../models");

// Controlador para buscar todas las facturas con posibilidad de paginación
const getInvoice = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;//Se obtienen los parámetros de consulta limit y from de req.query.
  const query = { status: true };//Se define el objeto query que contiene el filtro de búsqueda para las facturas activas.

  // Ejecuta ambas promesas en paralelo para mejorar el rendimiento
  const [invoice] = await Promise.all([
    // Busca facturas en la base de datos según el filtro y los campos de usuario especificados
    Invoice.find(query)
      .populate("user", "name")
      .skip(from)
      .limit(limit),
    // Cuenta la cantidad de facturas en la base de datos según el filtro
    Invoice.countDocuments(query),
  ]);

  res.status(200).json({
    invoice,
  });
};

// Controlador para buscar una factura por su ID
const getInvoiceById = async (req = request, res = response) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id)
    .populate("user", "name");

  res.status(200).json(invoice);
};

// Controlador para crear una nueva factura
const createInvoice = async (req, res = response) => { // POST Enviar datos
  const { status, user, ...body } = req.body;

  // Verifica si ya existe una factura con el mismo nombre en la base de datos
  const invoiceDB = await Invoice.findOne({ name: body.name });

  // Crea un objeto de datos a partir del cuerpo de la solicitud, agrega el ID del usuario y crea una nueva factura en la base de datos
  const data = {
    ...body,
    user: req.user._id,
  };
  const invoice = new Invoice(data);
  await invoice.save();

  res.status(200).json(invoice);
};

// Controlador para actualizar una factura existente por su ID
const updateInvoice = async (req, res) => { //Actualizar datos PUT
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  // Agrega el ID del usuario y actualiza los campos de la factura en la base de datos
  data.user = req.user._id;
  const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true });

  res.json(invoice);
};

// Controlador para eliminar una factura existente por su ID
const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  // Actualiza el estado de la factura en la base de datos
  const deletedInvoice = await Invoice.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(deletedInvoice);
};

module.exports = {
  getInvoice,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};