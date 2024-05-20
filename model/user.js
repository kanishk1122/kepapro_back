import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");

const userSchema = mongoose.Schema({
    id: String,
    username: String,
    doj: {
        type: Date,
        default: Date.now()
    },
    email:String,
    password: String,
    passkey:String,
    pi:String,
    bookmark:{
        type : Array,
        default : [""]
    },
});

const User = mongoose.model("User", userSchema);

export default User;
