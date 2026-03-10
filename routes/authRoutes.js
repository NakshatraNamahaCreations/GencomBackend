const express = require("express");
const router = express.Router();

const { register, login } = require("../Controllers/authController");
const {verifyToken} = require("../middleware/authMiddleware");

router.post("/register",register);

router.post("/login",login);


/* Example protected route */

router.get("/dashboard",verifyToken,(req,res)=>{

  res.json({
    message:"Welcome to protected dashboard",
    userId:req.userId
  });

});

module.exports = router;    