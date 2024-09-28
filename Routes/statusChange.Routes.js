const {Router} = require("express")
const {adminMiddlewares} = require("../middlewares/admin.middleware")
const {orderModel} = require("../model/order.model")
const statusChangeRouter = Router()



//  additional router 

// Update order status (Admin Only)
statusChangeRouter.put("/:orderId", adminMiddlewares, async (req, res) => {
    const userId = req.user
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    try {

        if (!orderStatus || !['Pending', 'Shipped', 'Delivery'].includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});


module.exports ={
    statusChangeRouter
}