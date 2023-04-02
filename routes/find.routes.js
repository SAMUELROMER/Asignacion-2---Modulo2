const { Router } = require("express");
const { find } = require("../controllers/find.controller");

const router = Router();

router.get("/:collection/:term", find);

module.exports = router;
