const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sendMail = require('../ultils/sendMail');

const User = require('../models/user');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../middlewares/jwt');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing inputs',
    });
  }

  const user = await User.findOne({ email });
  if (user) throw new Error('User has existed');
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? 'Register is successfully. Please go login~'
        : 'Something went wrong',
    });
  }
});

// refreshToken -> cấp mới accessToken
// accessToken -> xác thực + phân quyền
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing inputs',
    });
  }
  //plan object
  // tìm user có trường là email
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // móc password và role ra
    const { password, role, ...userData } = response.toObject();
    // tạo accessToken
    const accessToken = generateAccessToken(response._id, role);
    //tạo refreshToken
    const refreshToken = generateRefreshToken(response._id);
    // lưu refreshToken vào database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // lưu thằng refreshToken vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else throw new Error('Invalid credentials');
});

const getCurrent = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).select('-refreshToken -password -role');
  return res.status(200).json({
    success: user ? true : false,
    data: user ? user : 'User not found',
  });
});

//cấp lại access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // lấy cookie từ req.cookies
  const cookie = req.cookies;
  // kiểm tra có tồn tại cookie và refresh token hay ko
  if (!cookie && !cookie.refreshToken)
    throw new Error('No refresh token in cookie');
  // xác thực refresh token => decode là kết quả trả về nếu đúng => decode = {_id: ...}
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : 'Refresh token invalid',
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error('No refresh token in cookies');
  // xoa refresh token trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: '' },
    { new: true }
  );
  // xoa refresh token cookies tai trinh duyet
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Logout is done',
  });
});

// → Client gửi email
// → Server check email có hợp lệ hay không ⇒ gửi email + kèm theo link (password change token)
// → Client check mail ⇒ click link
// → Client gửi api kèm theo token
// → Server check token có giống với token mà server gửi mail hay không
// → Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error('Missing email');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đấy để thay đổi mật khẩu của bạn. Link sẽ hết hạn sau 15 phút <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = { email, html };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error('Missing inputs');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Invalid reset token');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? 'Updated password' : 'Something went wrong',
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select('-refreshToken -password -role');
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const _id = req.query;
  if (!_id) throw new Error('Missing inputs');
  const response = await User.findByIdAndDelete(_id);

  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `Deleted user with email: ${response.email}`
      : 'No user delete',
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const _id = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error('Missing inputs');
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select('-password -role  -refreshToken');

  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : 'Something went wrong',
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select('-password -role -refreshToken');

  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : 'Something went wrong',
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
