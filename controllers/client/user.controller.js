const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");

module.exports.register = async (req, res) => {
  const user = req.body;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if(existUser) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
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

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if(!existUser) {
    res.json({
      code: "error",
      message: "Tài khoản không tồn tại trong hệ thống!"
    });
    return;
  }


  if(md5(user.password) != existUser.password) {
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
    message: "Đăng ký thành công!",
    token: existUser.token
  })
}