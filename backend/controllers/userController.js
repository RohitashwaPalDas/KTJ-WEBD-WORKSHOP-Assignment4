import userModel from "../models/user.js";
import validator from 'validator'
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body.formData;
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists with this email address" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            date: Date.now()
        })
        const user = await newUser.save();

        const token = generateToken(user._id);
        res.json({ success: true, message: "Registered Successfully", token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body.formData;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User cannot found with this email address" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect Password" });
        }
        if (isMatch) {
            const token = generateToken(user._id);
            res.json({ success: true, message: "Logged In Successfully", token });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const userDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);

        const user = await userModel.findById(userId)
            .select("-password")
            .populate({
                path: "savedArticles",
                model: "SavedArticle",
                options: { sort: { savedAt: -1 } } // optional: newest first
            });

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, logInUser, userDetails };