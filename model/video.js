import mongoose from "mongoose";

mongoose.connect("mongodb+srv://apimails1:F8xaA76TOrDA64Rd@cluster0.ljlgl7m.mongodb.net/");

const videoSchema = mongoose.Schema({
    videolink: {
        type: Object, // Ensure videolink is required
    },
    language: String,
    season: Number,
    ep: Number,
    description:String,
    genres: [String],
    animename: String,
    thumnail: String,
    quality: Number,
    view: Number,
    rating:Number,
    popular: {
        type: Boolean
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
});

// Define a pre-save hook to update the 'popular' field based on the 'view' field
videoSchema.pre('save', function(next) {
    // Check if the 'view' field is over 1000
    if (this.view > 1000) {
        // If 'view' is over 1000, set 'popular' to true
        this.popular = true;
    } else {
        // Otherwise, set 'popular' to false
        this.popular = false;
    }
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
