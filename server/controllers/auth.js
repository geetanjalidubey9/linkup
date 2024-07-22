const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailService = require("../services/mailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Controller to register a new user
exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, userName, collegeName, email, password } = req.body;
  const filteredBody = filterObj(req.body, "firstName", "lastName", "userName", "collegeName", "email", "password",);

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use. Please login.",
    });
  } else if (existingUser && !existingUser.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use but not verified. Please login.",
    });
  } else if (existingUser) {
    await User.findOneAndUpdate({ email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });
    req.userId = existingUser._id;
  } else {
    const newUser = await User.create(filteredBody);
    req.userId = newUser._id;

    res.status(201).json({
      status: "success",
      message: "User signed up successfully.",
      data: { user: newUser },
    });
  }
});

// Controller to send OTP to user email
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { email,userId } = req;
  const newOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  const hashedOTP = await bcrypt.hash(newOtp.toString(), 10);
  const otpExpiryTime = Date.now() + 10 * 60 * 1000;

  const user = await User.findByIdAndUpdate(userId, { otp_expiry_time: otpExpiryTime, otp: hashedOTP });

  mailService.sendEmail({
    from: "gd8836383@gmail.com",
    to: user.email,
    subject: "Verification OTP",
    html: `Your OTP for verification is: ${newOtp}`,
  });

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
});

// Controller to verify OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await bcrypt.compare(otp, user.otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  user.verified = true;
  user.otp = undefined;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
  });
});

// Controller to log in user
exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const token = signToken(user._id);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    token,
    user_id: user._id,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // console.log("Headers:", req.headers); // Debugging log
  // console.log("Cookies:", req.cookies); // Debugging log
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log("Token received:", token); // Add this line to log the token

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const this_user = await User.findById(decoded.userId);
  if (!this_user) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist.",
    });
  }

  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password! Please log in again.",
    });
  }

  req.user = this_user;
  next();
});

// Controller to handle forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with that email address.",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:5173/reset-password/${encodeURIComponent(resetToken)}`;

  mailService.sendEmail({
    from: "gd8836383@gmail.com",
    to: user.email,
    subject: "Reset Password",
    html: `<p>Forgot your password? Click <a href="${resetURL}">here</a> to reset it.</p>`,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

// Controller to handle password reset
exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const newToken = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reset Successfully",
    token: newToken,
  });
});


// Controller to handle user logout
exports.logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt');

    // Check if req.user is defined and retrieve userId
    const userId = req.user ? req.user._id : null;

    // Optionally perform any additional logout tasks here

    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
      userId: userId, // Optionally return the userId if needed
    });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getProfile = async (req, res) => {
  // console.log('getProfile route hit'); // Debug log
  // console.log('req.user:', req.user); // Check if req.user is set

  try {
    // Find the user by their ID directly
    const profile = await User.findById(req.user._id).select('userName verified email firstName lastName collegeName degree collegeYear avatar collegeid');
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error in getProfile:', err.message); // Debug log
    res.status(500).send('Server Error');
  }
};
// Controller to update user profile including avatar and college ID
// exports.updateProfile = catchAsync(async (req, res, next) => {
//   console.log('updateProfile route hit');
//   console.log('req.body:', req.body); // Check req.body content
//   console.log('req.files:', req.files); // Check uploaded files

//   const { userName, firstName, lastName, collegeName, email, degree, collegeYear } = req.body;
//   let avatar = req.files?.avatar ? req.files.avatar[0].filename : undefined;
//   let collegeid = req.files?.collegeid ? req.files.collegeid[0].filename : undefined;

//   // Build profile object
//   const profileFields = {};
//   if (userName) profileFields.userName = userName;
//   if (firstName) profileFields.firstName = firstName;
//   if (lastName) profileFields.lastName = lastName;
//   if (collegeName) profileFields.collegeName = collegeName;
//   if (email) profileFields.email = email;
//   if (degree) profileFields.degree = degree;
//   if (collegeYear) profileFields.collegeYear = collegeYear;

//   // Check if avatar or collegeid is updated
//   if (avatar) profileFields.avatar = `/uploads/${avatar}`;
//   if (collegeid) profileFields.collegeid = `/uploads/${collegeid}`;

//   try {
//     // Update profile
//     let profile = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: profileFields },
//       { new: true, runValidators: true } // Use runValidators to ensure schema validation
//     );

//     if (!profile) {
//       return res.status(404).json({ msg: 'Profile not found' });
//     }

//     res.json(profile);
//   } catch (err) {
//     console.error('Error in updateProfile:', err.message);
//     res.status(500).send('Server Error');
//   }
// });


exports.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const updateData = req.body;

  try {
    // Separate known fields from additional fields
    const knownFields = ['userName', 'firstName', 'lastName', 'collegeName', 'email', 'Degree', 'collegeyear'];
    let knownFieldsData = {};
    let additionalFieldsData = {};

    for (let key in updateData) {
      if (knownFields.includes(key)) {
        knownFieldsData[key] = updateData[key];
      } else {
        additionalFieldsData[`additionalFields.${key}`] = updateData[key];
      }
    }

    // Debugging
    console.log('Known Fields Data:', knownFieldsData);
    console.log('Additional Fields Data:', additionalFieldsData);

    // Update the user with both known and additional fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...knownFieldsData, ...additionalFieldsData } },
      { new: true, runValidators: true, upsert: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});


// Controller to upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  console.log('uploadProfilePhoto route hit'); // Debug log
  console.log('req.user:', req.user); // Check if req.user is set
  console.log('req.file:', req.file); // Check uploaded file

  try {
    const groupProfilephoto = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!groupProfilephoto) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded or invalid file format',
      });
    }

    // Update user profile with the new avatar
    const user = await Chat.findByIdAndUpdate(
      req.user._id,
      { $set: { groupProfilephoto } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      status: 'success',
      message: 'Profile photo uploaded successfully',
      data: { groupProfilephoto },
    });
  } catch (err) {
    console.error('Error in uploadProfilePhoto:', err.message);
    res.status(500).send('Server Error');
  }
};

// exports.getAllUsers = async (req, res) => {
//   console.log('GETALL USER route hit'); // Debug log for route hit
  
//   try {
//     const users = await User.find({}, 'userName'); // Fetching usernames and names
//     console.log('Fetched users:', users); // Debug log to show fetched users
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error); // Debug log for error
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
exports.getAllUsers = async (req, res) => {
  console.log('GETALL USER route hit'); // Debug log for route hit
  
  try {
    const users = await User.find({});
    // const users = await User.find({}, 'userName avatar'); 
    console.log('Fetched users:', users); // Debug log to show fetched users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error); // Debug log for error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 
