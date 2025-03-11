const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares/auth.middlewares");

const controller = require("../../controllers/client/user.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/profile", middleware.requireAuth, controller.profile);

module.exports = router;