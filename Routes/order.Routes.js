const { Router } = require('express');
const orderRouter = Router();
const { orderModel } = require('../model/order.model');
const { userMiddlewares } = require("../middlewares/user.middleware");
const { z } = require('zod');
const mongoose = require('mongoose');

// Get all orders for the user
orderRouter.get('/', userMiddlewares, async (req, res) => {
    const userId = req.user;

    try {
        const orders = await orderModel.find({ userId }).populate('items.productId');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: "An error occurred while retrieving the orders", // Hide internal details
        });
    }
});

// Create a new order
orderRouter.post('/create', userMiddlewares, async (req, res) => {
    const userId = req.user;
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    try {
        // Zod schema validation for order creation
        const orderSchema = z.object({
            items: z.array(z.object({
                productId: z.string(),
                quantity: z.number().min(1),
            })),
            shippingAddress: z.object({
                address: z.string().min(1),
                city: z.string().min(1),
                state: z.string().min(1),
                postalCode: z.number(),
                country: z.string().min(1),
            }),
            paymentMethod: z.string().min(1),
            totalAmount: z.number().min(0),
        });

        const parsedData = orderSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                error: parsedData.error.errors,
            });
        }

        const newOrder = new orderModel({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: "An error occurred while creating the order", // Hide internal details
        });
    }
});

// Delete an order
orderRouter.delete('/cancel/:orderId', userMiddlewares, async (req, res) => {
    const { orderId } = req.params;

    // Check if orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
        const order = await orderModel.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: "An error occurred while deleting the order", // Hide internal details
        });
    }
});

module.exports = { orderRouter };
