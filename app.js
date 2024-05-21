import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import session from "express-session";
import cors from 'cors';
import usermodel from "./model/user.js";
import adminmodel from './model/admin.js';
import axios from "axios";
import multer from 'multer';
import video from './model/video.js';
let Token =""

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['https://kepapro.onrender.com', 'https://kepapro-back.onrender.com',"https://kepapro.vercel.app","http://localhost:4000","https://fantastic-journey-jjrx6wwjxxvjf5j6w-3000.app.github.dev/"], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    secure: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const upload = multer({ dest: 'uploads/' }); 

const checkToken = (req, res, next) => {
    const token = req.session.Token; 
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err);
                req.session.destroy(); 
                return res.status(401).json({ error: 'Unauthorized' });
            } else {
                req.user = decoded;
                next(); 
            }
        });
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get("/", (req, res) => {
    res.cookie("hey", "kansihk").send("Cookie set successfully!");
});

app.post("/register", async (req, res) => {
    try {
        const existingUser = await usermodel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                const newUser = await usermodel.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    age: req.body.age,
                });
              Token = jwt.sign({ email: req.body.email , username : req.body.username  }, process.env.JWT_SECRET || 'secret');
                res.send(Token);
                console.log(Token,"this from register");
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/createadmin", async (req, res) => {
    try {
        const existingUser = await adminmodel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                const newAdmin = await adminmodel.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    age: req.body.age,
                });
                Token = jwt.sign({ email: req.body.email , username : req.body.username  }, process.env.JWT_SECRET || 'secret');
                res.send(Token);
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
});


app.post("/login", async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (passwordMatch) {
            Token = jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET || 'secret') ;
            return res.send(Token);
        } else {
            console.log("Incorrect password");
            return res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
});




app.post("/adminlogin", async (req, res) => {
    try {
        const admin = await adminmodel.findOne({ email: req.body.email });
        if (!admin) {
            console.log("Admin not found");
            return res.status(404).send("Admin not found");
        }

        const passwordMatch = await bcrypt.compare(req.body.password, admin.password);
        if (passwordMatch) {
            Token = jwt.sign({ email: req.body.email , username : req.body.username  }, process.env.JWT_SECRET || 'secret');
            res.send(Token);
        } else {
            console.log("Incorrect password");
            return res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/addlink', async (req, res) => {
    try {
        const { links, languages, season, ep, description, rating, genres, thumnail, qualities, animename } = req.body;

        const videoDocuments = [];

        for (let i = 0; i < links.length; i++) {
            const newVideo = await video.create({
                videolink: links[i],
                language: languages[i],
                season,
                ep: ep[i],
                description,
                genres,
                thumnail,
                quality: qualities[i],
                rating,
                animename,
            });

            videoDocuments.push(newVideo);
        }

        res.status(200).json({ message: 'Video details added successfully', videos: videoDocuments });
    } catch (error) {
        console.error('Error adding video details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/getall", async (req, res) => {
    try {
        const response = await video.find({ season: 1, ep: 1, quality: 720 });
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/userdetail", async (req, res) => {
   try {
    const oneuser = await usermodel.findOne({email:req.body.email})
    res.send(oneuser)
    
   } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
   }
});   


app.post("/user/addBookmark", async (req, res) => {
    try {
        

        if (!req.body.email || !req.body.animename || !req.body.season || !req.body.ep) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        console.log(`Adding bookmark for user: ${req.body.email}`);

        const user = await usermodel.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send({ message: "User not found" });
        }

        const result = await usermodel.updateOne(
            { email: req.body.email },
            {
                $push: {
                    bookmarks: {
                        animename : req.body.animename,
                         season :req.body.season,
                          ep:req.body.ep,
                         }
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log("Bookmark added successfully");
            res.status(200).send({ message: "Bookmark added successfully" });
        } else {
            console.log("Bookmark not added");
            res.status(500).send({ message: "Bookmark not added" });
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});

// app.post("/userdetailupdate", async (req, res) => {
//     try {
//         const result = await usermodel.updateOne(
//             { email: req.body.email },    
//             {
//                 $set: {
//                     username: req.body.username,    
//                     userpic: req.body.userpic,
                   
//                 }
//             }
//         );

//         if (result.modifiedCount > 0) {
//             res.status(200).send({ message: "User details updated successfully" });    
//         } else {
//             res.status(404).send({ message: "User not found" });    
//         }
//     } catch (error) {
//         res.status(500).send({ message: "An error occurred", error: error.message });    
//     }
// });




  
// app.post("/user/updateBookmark", async (req, res) => {
//     try {
//         const { email, bookmarkIndex, animename, season, ep } = req.body;

//         const updateField = `bookmarks.${bookmarkIndex}`;

//         const result = await usermodel.updateOne(
//             { email },
//             {
//                 $set: {
//                     [`${updateField}.animename`]: animename,
//                     [`${updateField}.season`]: season,
//                     [`${updateField}.ep`]: ep
//                 }
//             }
//         );

//         if (result.modifiedCount > 0) {
//             res.status(200).send({ message: "Bookmark updated successfully" });
//         } else {
//             res.status(404).send({ message: "User not found or bookmark not found" });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "An error occurred", error: error.message });
//     }
// });


app.get("/watchall", async (req, res) => {
    try { 
        const response = await video.find();
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listUploadedUrls", checkToken, async (req, res) => {
    try {
        const apiKey = '396272eryk12p9b7hdsjkc'; 
        const response = await axios.get(`https://doodapi.com/api/urlupload/list?key=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error listing uploaded URLs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(); 
    res.redirect("/");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
