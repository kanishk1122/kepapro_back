import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");



const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    doj: {
        type: Date,
        default: Date.now
    },
    pi:String,
    bookmarks: [{
        animename: String,
        season: Number,
        ep: Number
    }]
});

const User = mongoose.model("User", userSchema);

export default User;
