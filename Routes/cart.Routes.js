const { Router } = require("express");
const { userMiddlewares } = require("../middlewares/user.middleware");
const { cartModel } = require("../model/cart.model");
const { z } = require('zod');
const mongoose = require('mongoose');
const cartRouter = Router();

// Get all the cart products
cartRouter.get('/', userMiddlewares, async (req, res) => {
    const userId = req.user;

    try {
        if (!userId) {
            return res.status(401).json({
                message: "User ID not found",
            });
        }

        const cartProducts = await cartModel.find({ userId }).populate('productId');

        if (!cartProducts || cartProducts.length === 0) {
            return res.status(404).json({
                message: "Cart products not found",
            });
        }

        res.status(200).json({
            message: "Successfully retrieved all cart products",
            cartProducts,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: "An error occurred while retrieving the cart products", // Hide internal details
        });
    }
});

// Add a product to the cart
cartRouter.post('/add', userMiddlewares, async (req, res) => {
    const userId = req.user;

    try {
        if (!userId) {
            return res.status(400).json({
                message: "User ID cannot be found",
            });
        }

        const { productId, quantity } = req.body;

        // Zod schema validation
        const verifySchema = z.object({
            productId: z.string(),
            quantity: z.number().min(1).max(100),
        });

        const verifySchemaSafeParse = verifySchema.safeParse(req.body);

        if (!verifySchemaSafeParse.success) {
            return res.status(400).json({
                message: "Invalid input format",
                error: verifySchemaSafeParse.error,
            });
        }

        // Check if the product already exists in the cart
        const existingProduct = await cartModel.findOne({ userId, productId });

        if (existingProduct) {
            existingProduct.quantity += quantity;
            await existingProduct.save();
        } else {
            const newCartItem = new cartModel({
                userId,
                productId,
                quantity,
            });
            await newCartItem.save();
        }

        res.status(201).json({
            message: "Product added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: "An error occurred while adding the product to the cart", // Hide internal details
        });
    }
});

// Update the quantity of a cart item
cartRouter.put('/update/:itemId', userMiddlewares, async (req, res) => {
    const userId = req.user;
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({
                message: "User ID cannot be found",
            });
        }

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                message: "Invalid Item ID",
            });
        }

        if (typeof quantity === 'undefined') {
            return res.status(400).json({
                message: "Quantity must be provided",
            });
        }

        const product = await cartModel.findOne({ userId, _id: itemId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found in the cart",
            });
        }

        product.quantity = quantity;
        await product.save();

        res.status(200).json({
            message: "Product quantity updated successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: "An error occurred while updating the product", // Hide internal details
        });
    }
});

// Remove an item from the cart
cartRouter.delete('/remove/:itemId', userMiddlewares, async (req, res) => {
    const userId = req.user;
    const { itemId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({
                message: "User ID cannot be found",
            });
        }

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                message: "Invalid Item ID",
            });
        }

        const product = await cartModel.findOneAndDelete({ userId, _id: itemId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found in the cart",
            });
        }

        res.status(200).json({
            message: "Product removed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: "An error occurred while removing the product from the cart", // Hide internal details
        });
    }
});

module.exports = { cartRouter };
