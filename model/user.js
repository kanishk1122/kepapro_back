import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");



const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String,  unique: true },
    password: { type: String},
    age: { type: Number },
    doj: {
        type: Date,
        default: Date.now
    },
    userpic:String,
    bookmarks: [{
        animename: String,
        season: Number,
        ep: Number
    }]
});

const User = mongoose.model("User", userSchema);

export default User;
