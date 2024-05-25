import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");

const commentSchema = new mongoose.Schema({
    email: String,
    comment: String
});

const videoSchema = new mongoose.Schema({
    videolink: {
        type: Object,
        required: true, // Ensure videolink is required
    },
    language: String,
    season: Number,
    ep: Number,
    description: String,
    genres: [String],
    animename: String,
    thumnail: String,
    quality: Number,
    view: Number,
    rating: Number,
    popular: {
        type: Boolean,
        default: false // Default value for popular
    },
    dou: {
        type: Date,
        default: Date.now()
    },
    new: {
        type: Boolean,
        default: true,
    },
    trending: {
        type: Boolean,
        default: false,
    },
    comments: [commentSchema]
});

// Define a pre-save hook to update the 'popular' field based on the 'view' field
videoSchema.pre('save', function(next) {
    this.popular = this.view > 1000;
    next();
});

// Function to update the 'new' field to false after 10 days
videoSchema.methods.updateNewFieldAfterDelay = function() {
    const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
    const document = this;

    setTimeout(() => {
        document.new = false;
        document.save((err) => {
            if (err) {
                console.error('Error updating document:', err);
            } else {
                console.log('Document updated successfully:', document);
            }
        });
    }, tenDaysInMillis);
};

// Method to check if the video is trending
videoSchema.methods.checkTrending = function() {
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const currentTime = Date.now();

    // Find the timestamp of three days ago
    const threeDaysAgo = new Date(currentTime - threeDaysInMillis);

    // Check if the view count within the last three days is greater than or equal to 300
    if (this.dou >= threeDaysAgo && this.view >= 300) {
        this.trending = true;
    } else {
        this.trending = false;
    }
};

const Video = mongoose.model("Video", videoSchema);

export default Video;
