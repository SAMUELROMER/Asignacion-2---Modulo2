const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (!req.user)
    return res.status(500).json({
      msg: "you are trying to validate a role without validate token first",
    });

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE")
    return res.status(401).json({
      msg: `${name} is not an administrator to process this request`,
    });

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user)
      return res.status(500).json({
        msg: "you are trying to validate a role without validate token first",
      });

    if (!roles.includes(req.user.role))
      return res.status(401).json({
        msg: `the services require one of these roles: ${roles}`,
      });

    next();
  };
};

module.exports = { isAdminRole, hasRole };
