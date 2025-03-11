const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");


const userService = require("../../services/user.service");
const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper")

module.exports.register = async (req, res) => {
  const user = req.body;
  const password = req.body.password;
  const email = req.body.email;
  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if (existUser) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: userService.createNewUser(password),
    token: generateHelper.generateRandomString(30)
  };

  const newUser = new User(dataUser);
  await newUser.save();
  res.json({
    code: "success",
    message: "Đăng ký thành công!",
    token: newUser.token
  })
}

module.exports.login = async (req, res) => {
  const user = req.body;
  const email = req.body.email;
  const password = req.body.password;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: "error",
      message: "Tài khoản không tồn tại trong hệ thống!"
    });
    return;
  }

  const userCheck = await userService.checkUser(email, password);
   // Lưu kết quả trả về vào một biến
  if (!userCheck) { // neu mk sai thi ham nay se chay
    res.json({
      code: "error",
      message: "Sai mật khẩu"
    });
    return;
  }

  // if(existUser.deleted != "false") {
  //   res.json({
  //     code: "error",
  //     message: "Tài khoản đang bị khoá"
  //   });
  //   return;
  // }

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
    token: existUser.token
  })
}

module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống"
    });
    return;
  }

  // Việc 1:lưu otp vào database 

  const existForgotPassword = await ForgotPassword.findOne({
    email: email
  });

  if (!existForgotPassword) {
    const otp = generateHelper.generateRandomNumber(8);
    const data = {
      email: email,
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    const newForgotPassword = new ForgotPassword(data);
    await newForgotPassword.save();

    // Việc 2: gửi mail otp cho người dùng
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
    sendMailHelper.sendMail(email, subject, text);
  }

  res.json({
    code: "success",
    message: "Gửi mã OTP thành công!"
  })
}

module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const existOtp = await ForgotPassword.findOne({
    otp: otp,
    email: email
  });

  if (!existOtp) {
    res.json({
      code: "error",
      message: "Mã Otp sai"
    });
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.json({
    code: "success",
    message: "Mã OTP hợp lệ!",
    token: user.token
  })

}

module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;

  await User.updateOne({
    token: token
  }, {
    password: userService.createNewUser(password)
  });

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công"
  })
}

module.exports.profile = async (req, res) => {
  const token = req.body.token;

  if(!token) {
    res.json({
      code: "error",
      message: "Vui lòng gửi kèm theo token!"
    });
    return;
  }

  const user = await User.findOne({
    token: token,
    deleted: false
  }).select("id fullName email");

  if(!user) {
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    });
    return;
  }

  res.json({
    code: "success",
    message: "Thành công!",
    data: user
  });
}