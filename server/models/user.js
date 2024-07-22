const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  about: {
    type: String,
  },
  __v: { type: Number, select: false },
  avatar: {
    data: Buffer,
    contentType: String
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    sparse: true,
    validate: {
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      message: (props) => `Email (${props.value}) is invalid!`,
    },
  },
  CollegId:{
    data: Buffer,
    contentType: String
  },
  Collegeyear:{
    type: String,
  },
  Degree:{
    type: String,
  },
  password: {
    type: String,
    // required: [true, "Password is required"],
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otp_expiry_time: {
    type: Date,
  },
  collegeName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],

  socket_id: {
    type: String
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Away'],
    default:"Offline"
},
friendRequests: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName:{type:String},
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
],
  confirmPassword: {
    type: String,
    // required: true,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Passwords do not match",
    },
  },
});
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("otp") || !this.otp) return next();

  // Hash the otp with cost of 12
  this.otp = await bcrypt.hash(this.otp.toString(), 12);

  console.log(this.otp.toString(), "FROM PRE SAVE HOOK");

  next();
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password") || !this.password) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //! Shift it to next hook // this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew || !this.password)
    return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});



userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
// userSchema.index({ email: 1 }, { unique: true });
const User = new mongoose.model("User", userSchema);
module.exports = User;
