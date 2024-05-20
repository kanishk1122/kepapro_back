import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");

const bookmarkSchema = new mongoose.Schema({
    animename: {
        type: String,
        default: ""
    },
    season: {
        type: Number,
        default: ""
    },
    ep: {
        type: Number,
        default: ""
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    doj: {
        type: Date,
        default: Date.now
    },
    email: String,
    password: String,
    passkey: String,
    pi: String,
    userpic: String,
    bookmark: {
        type: bookmarkSchema,
        default: () => ({})
    }
});

const User = mongoose.model("User", userSchema);

export default User;
