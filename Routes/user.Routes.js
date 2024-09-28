const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const { userModel } = require('../model/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const userRouter = Router();

// User Signup Route
userRouter.post('/signup', async (req, res) => {
    const { userName, email, password, confirmPassword, contactNumber } = req.body;

    // Define schema to validate the incoming request body using zod
    const verifySchema = z.object({
        userName: z.string().min(3).max(20),
        email: z.string().min(3).max(50).email(),
        password: z.string().min(6).max(20),
        contactNumber: z.string().length(10), // Contact number as a string of exactly 10 digits
        confirmPassword: z.string().min(6).max(20)
    });

    // Validate request body against the schema
    const verifySchemaSafeParse = verifySchema.safeParse(req.body);

    // If validation fails, return Bad Request (400)
    if (!verifySchemaSafeParse.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: verifySchemaSafeParse.error.errors
        });
    }

    try {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await userModel.create({
            userName,
            email,
            password: hashedPassword, // Store the hashed password
            contactNumber,
        });

        // Return success response
        res.status(201).json({
            message: "User signup successful",
            user
        });

    } catch (error) {
        // Handle any server-side errors
        return res.status(500).json({
            message: "Something went wrong during signup",
            error: error.message
        });
    }
});

// User Login Route
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Define schema to validate the incoming request body using zod
    const verifySchema = z.object({
        email: z.string().min(3).max(50).email(),
        password: z.string().min(6).max(20),
    });

    // Validate request body against the schema
    const verifySchemaSafeParse = verifySchema.safeParse(req.body);

    // If validation fails, return Bad Request (400)
    if (!verifySchemaSafeParse.success) {
        return res.status(400).json({
            message: "All fields are required",
            error: verifySchemaSafeParse.error.errors
        });
    }

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });

        // If user is not found, return Not Found (404)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare provided password with the stored hashed password
        const verifyPassword = await bcrypt.compare(password, user.password);

        // If password does not match, return Unauthorized (401)
        if (!verifyPassword) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Generate JWT token for the user
        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_USER, {
            expiresIn: '1h' // Token valid for 1 hour
        });

        // Set the token in the response cookies
        res.cookie('userToken', userToken, {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true, // Secure cookie
        });

        // Return success response with the token
        res.status(200).json({
            message: "User login successful",
            userToken
        });

    } catch (error) {
        // Handle any server-side errors
        return res.status(500).json({
            message: "Something went wrong during login",
            error: error.message
        });
    }
});

module.exports = {
    userRouter
};
