const mongoose = require("mongoose");
const crypto = require("crypto");
const { createTokenForUser } = require("../utils/authentication");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
    },

    profileImgURL: {
      type: String,
      default: "/imgs/profile.jpg",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return;

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("user not found");

  const salt = user.salt;
  const userpassword = user.password;

  const userProvidedHash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(userpassword !== userProvidedHash) throw new Error("Incorrect password");

    const token = createTokenForUser(user);

  return token;
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
