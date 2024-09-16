const express = require("express");
const router = express.Router();
const multer = require("multer");
const blogModel = require("../models/blog");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, `./public/uploads/`);
    },
    filename: function (req, file, cb){
        const fileNmae = `${Date.now()}-${file.originalname}`;
        cb(null, fileNmae);
    }
});

const uploads = multer({ storage })

router.get("/add-blog", (req,res) => {
    res.render("addBlog", {
        user: req.body
    });
});

router.post("/add-blog", uploads.single('coverimg'), async (req,res) => {
    // console.log(req.body);
    // console.log(req.file);
    
    const { title, body } = req.body;

    await blogModel.create({
        title,
        body,
        postedBy: req.user._id,
        coverImgURL: `/uploads/${req.file.filename}`
    })
    res.redirect('/');  
});

router.get("/:id", async (req,res) => {
    const blog = req.params.id;
    const perticularBlog = await blogModel.findOne({_id: blog}).populate('postedBy');
    console.log(perticularBlog);
    
    return res.render("blog", {
        user: req.user,
        blog: perticularBlog,
    });
});

module.exports = router