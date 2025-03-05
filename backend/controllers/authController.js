const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn:"1h"});
};

//register user
exports.registerUser = async(req, res) => {
    const {fullName, email, password, profileImageUrl} = req.body;

    //validation: check for missing fields
    if(!fullName|| !email || !password){
        return res.status(400).json({message:"All feilds are required"});
    }

    try{
        //check email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }

        //create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err){
        res
            .status(500)
            .json({message: "Error registering user", error:err.message});
    }
    
};

//login user
exports.loginUser = async (req, res) => {
    const{email, password} = req.body;
    if(!email||!password){
        return res.status(400).json({message:"All fields are require"});
    }
    try{
        const user = await User.findOne({email});
        if(!user||!(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch(err){
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    }
 };

//get user information
exports.getUserInfo = async (req, res) => { 
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        res.status(200).json(user);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });

    }
};