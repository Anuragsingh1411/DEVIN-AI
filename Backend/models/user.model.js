import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema
({
    email:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters"],
        maxLength: [32, "Email must be at most 32 characters"],
    },
    password:{
        type:String,
        select: false,
    }
})


userSchema.statics.hasPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (password) {
  const user = await this.model("user").findById(this._id).select("+password");
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const User = mongoose.model("user", userSchema);

export default User;
