const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
} = require("../controllers/usercontroller");

router.post("/create", createUser);
router.get("/:address", getUser);

module.exports = router;