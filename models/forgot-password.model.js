const mongoose = require("mongoose");
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        default: Date.now,  // Mặc định sẽ là thời gian hiện tại
        index: { expires: '5m' }  // TTL sau 5 phút
    }
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;