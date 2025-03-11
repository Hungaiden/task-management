const bcrypt = require('bcrypt');
const salt = 10;
const User = require("../models/user.model");
const hashPassword = (userPassword) => {
    const hash = bcrypt.hashSync(userPassword, salt);
    return hash;
}

const createNewUser = (password) => {
    let hassPass = hashPassword(password);
    return hassPass;
}

const checkUser = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        return false; // Trường hợp người dùng không tồn tại
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(password, user.password); // Sử dụng bcrypt.compare() bất đồng bộ
    return isMatch;
}

module.exports = {
    createNewUser,
    checkUser
}