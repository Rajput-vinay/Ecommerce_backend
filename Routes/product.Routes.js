const { Router } = require('express');
const { adminMiddlewares } = require('../middlewares/admin.middleware');
const { z } = require('zod');
const { productModel } = require('../model/product.model');
const productRouter = Router();

//  Fetch all admin products
productRouter.get("/", adminMiddlewares, async (req, res) => {
    const adminId = req.user;  // Retrieve the adminId from the authenticated user's request
    try {
        // If adminId is missing, return Unauthorized (401)
        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized: adminId not found"
            });
        }

        // Find all products created by the admin
        const products = await productModel.find({ creatorId: adminId });

        // If no products found, return Not Found (404)
        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found for the admin"
            });
        }

        // Return success response with products
        res.status(200).json({
            message: "Fetched all products for the admin",
            products
        });

    } catch (error) {
        // Catch and return any server-side errors
        return res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

//  Create a product
productRouter.post("/", adminMiddlewares, async (req, res) => {
    const { productName, description, price, category, stock, imageUrl } = req.body;

    // Define schema to validate incoming request body using zod
    const verifySchema = z.object({
        productName: z.string().min(5).max(50),
        description: z.string().min(10).max(500),
        price: z.number(),
        category: z.string().min(5).max(20),
        stock: z.number().int().finite(),
        imageUrl: z.string().url(),
    });

    // Parse and validate the request body
    const verifySchemaSafeParse = verifySchema.safeParse(req.body);

    // If validation fails, return Bad Request (400)
    if (!verifySchemaSafeParse.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: verifySchemaSafeParse.error.errors
        });
    }

    try {
        const adminId = req.user;  // Get the adminId from authenticated user

        // If adminId is missing, return Unauthorized (401)
        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized: adminId not found. Please login"
            });
        }

        // Create a new product
        const product = await productModel.create({
            productName,
            description,
            price,
            category,
            stock,
            imageUrl,
            creatorId: adminId
        });

        // Return success response with created product
        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        // Catch and return server-side error
        return res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
});

//  Update the details of a product
// Update the details of a product
productRouter.put('/:id', adminMiddlewares, async (req, res) => {
    const { productName, description, price, category, stock, imageUrl } = req.body;
    const productId = req.params.id; // Extract productId from URL

    // Define schema to validate incoming request body using zod
    const verifySchema = z.object({
        productName: z.string().min(5).max(50).optional(),
        description: z.string().min(10).max(500).optional(),
        price: z.number().positive().optional(),
        category: z.string().min(3).max(20).optional(),
        stock: z.number().int().nonnegative().optional(),
        imageUrl: z.string().url().optional(),
    });

    // Parse and validate the request body
    const verifySchemaSafeParse = verifySchema.safeParse(req.body);

    // If validation fails, return Bad Request (400)
    if (!verifySchemaSafeParse.success) {
        return res.status(400).json({
            message: "Validation failed",
            error: verifySchemaSafeParse.error.errors
        });
    }

    try {
        // Update the product details using the provided ID and request body
        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: productId, creatorId: req.user },
            { $set: req.body },
            { new: true } // Return the updated document
        );

        // If no product was found for the given ID, return Not Found (404)
        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found or you're not authorized to update this product"
            });
        }

        // Return success response with updated product
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        // Catch and return server-side errors
        return res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});
//  Delete a product
productRouter.delete("/:id", adminMiddlewares, async (req, res) => {
    try {
        const adminId = req.user;  // Get the adminId from authenticated user

        // If adminId is missing, return Unauthorized (401)
        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized: adminId not found"
            });
        }

        const productId = req.params.id;  // Extract productId from URL

        // If productId is missing, return Not Found (404)
        if (!productId) {
            return res.status(404).json({
                message: "Product ID not provided"
            });
        }

        // Delete the product with the given ID
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        // If no product was found for the given ID, return Not Found (404)
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Return success response after deletion
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });

    } catch (error) {
        // Catch and return server-side errors
        return res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});




module.exports = {productRouter};
