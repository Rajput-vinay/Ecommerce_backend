const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },

            quantity: {
                type: Number, required: true
            }
        }
    ],

    shippingAddress: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
            required: true,
        },
        country: {
            type: String,
            required: true
        },



        paymentMethod: {
            type: String,

        },

        paymentStatus: {
            type: String,
            default: "Pending",
        },

    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivery'],
        default: 'Pending'
    },

    totalAmount: {
        type: Number,
    },



}, { timestamps: true })

const orderModel = mongoose.model('Order', orderSchema)
module.exports = {
    orderModel
}