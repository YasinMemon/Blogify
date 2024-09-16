const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuth } = require('./middlewares/auth');
const port = 8000;

const blogModel = require("./models/blog");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuth("token"));
app.use(express.static('public'))

app.use("/user", userRoute);
app.use("/blog", blogRoute);

mongoose.connect("mongodb://localhost:27017/blogify")
.then((e) => console.log("mogodb is connected")
);

app.get("/", async (req,res) => {
    const allBlogs = await blogModel.find();

    res.render("home", {
        user: req.user,
        allBlogs
    });
});

app.listen(port, (req,res) => {
    console.log(`app is listening on http://localhost:${port}/`);
});