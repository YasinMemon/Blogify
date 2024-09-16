const express = require("express");
const userModel = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/signin", (req,res) => {
    res.render("signin");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).send("user already exist. please use a different email....");
        } 

        await userModel.create({
            fullName,
            email,
            password,
        });
        
        return res.redirect("/");
    } catch (err) {
        console.error("Error creating user: ", err);
        return res.status(500).send("An error accured while creating user");        
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userModel.matchPasswordAndGenerateToken(email, password);
        res.cookie("token",token);
        res.redirect("/");        
    } catch (err) {
        console.log(err);
        res.status(500).render("signin", {
            error: "Incorrect email or password"
        });
    }
});

router.get('/logout', (req,res) => {
    res.clearCookie("token");
    res.redirect('/');
})

module.exports = router