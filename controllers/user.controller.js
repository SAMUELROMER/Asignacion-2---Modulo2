const { response } = require("express");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");

const usersGet = async (req, res = response) => {
  // const query = req.query;
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  // const users = await User.find(query).skip(from).limit(limit);

  // const total = await User.countDocuments(query);

  const [users, total] = await Promise.all([
    User.find(query).skip(from).limit(limit),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

const userPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.status(200).json({
    data: user,
  });
};

const userPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...user } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
  }

  const userDB = await User.findByIdAndUpdate(id, user);

  res.status(200).json({
    user: userDB,
  });
};

const userDelete = async (req, res = response) => {
  const { id } = req.params;

  // const user = await User.findByIdAndDelete(id);
  const user = await User.findByIdAndUpdate(id, { status: false });
  const userAuthenticated = req.user;

  res.status(200).json({
    user,
    userAuthenticated,
  });
};

module.exports = {
  usersGet,
  userPost,
  userPut,
  userDelete,
};
