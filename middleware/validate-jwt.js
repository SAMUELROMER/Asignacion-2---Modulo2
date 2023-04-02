const { request, response } = require("express");

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).json({ msg: "Token does not exist" });
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if (!user)
      return res
        .status(401)
        .json({ msg: "Token not valid: User does not exist" });

    if (!user.status)
      return res.status(401).json({ msg: "Token not valid: status - false" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Token not valid" });
  }
};

module.exports = {
  validateJWT,
};
