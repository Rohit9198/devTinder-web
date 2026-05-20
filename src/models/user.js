const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 0,
          minNumbers: 1,
          minSymbols: 0,
        })) {
          throw new Error("Password must be strong: 8+ chars, 1 lowercase, 1 number.");
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    isPremium: { type: Boolean, default: false },
    membershipType: { type: String },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: { type: String, default: "This is a default about of the user!" },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ---------------- HASH PASSWORD BEFORE SAVE ----------------
userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// ---------------- GENERATE JWT ----------------
userSchema.methods.getJWT = async function () {
  const user = this;
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------- VALIDATE PASSWORD ----------------
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("User", userSchema);
