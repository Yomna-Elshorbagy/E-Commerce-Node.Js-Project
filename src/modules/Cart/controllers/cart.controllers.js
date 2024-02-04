
import express from 'express';
import userModel from '../../../../db/models/user.model.js';
import productModel from '../../../../db/models/product.model.js';
import CartModel from '../../../../db/models/cart.model.js';
import couponModel from '../../../../db/models/Coupon.model.js';
import orderModel from '../../../../db/models/order.model.js';
import uniqid from 'uniqid';



////////////////////////////////////////////////////////////////////

export const userCart = async (req, res) => {
    const { cart } = req.body;

    try {
        if (!req.userid) {
            return res.status(401).json({ status: "FAIL", data: { message: "You do not have permission to add to cart" } });
        }
        
        // Check if the user already has a cart
        const existingCart = await CartModel.findOne({ orderBy: req.userid });

        if (existingCart) {
            // Remove the existing cart if it exists
            await CartModel.deleteOne({ _id: existingCart._id });
        }

        let products = [];

        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i].product;
            object.count = cart[i].count;
            // Fetch the price of the product
            const existingProduct = await productModel.findById(cart[i].product);
            if (!existingProduct) {
                return res.status(404).json({ status: "FAIL", data: { message: 'Product not found' } });
            }
            const productPrice = existingProduct.priceAfterDiscount;
            object.price = productPrice;
            products.push(object);
        }

        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            totalPrice = totalPrice + products[i].price * products[i].count;
        }

        let newCart = await new CartModel({
            cart: products, 
            totalPrice,
            orderBy: req.userid,
            products: products, 
        }).save();

        res.status(200).json({ status: "SUCCESS", message: "Cart created successfully", data: { newCart } });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};

// to get user cart
export const getUserCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ orderBy: req.userid }).populate("cart.product");

        res.status(200).json({ status: "SUCCESS", message: "Get user cart successful", data: cart });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};

// delete usercart
export const emptyCart = async (req, res) => {
    try {
        if (!req.userid) {
            return res.status(401).json({ status: "FAIL", data: { message: "You do not have permission to empty Cart" } });
        }
        const cart = await CartModel.findOneAndDelete({ orderBy: req.userid });

        res.status(200).json({ status: "SUCCESS", message: "Cart emptied successfully", data: cart });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};

//apply coupon
export const applyCoupon = async (req, res) => {
    try {
        const { coupon } = req.body;

        // Check if the coupon is valid
        const validCoupon = await couponModel.findOne({ couponCode: coupon });

        if (!validCoupon || validCoupon.deletedBy) {
            return res.status(401).json({ status: "FAIL", data: { message: "Invalid coupon" } });
        }

        // Find the cart and populate the product details
        const cart = await CartModel.findOne({ orderBy: req.userid }).populate("cart.product");

        if (!cart) {
            return res.status(404).json({ status: "FAIL", data: { message: "Cart not found" } });
        }

        // Calculate the price before discount and after discount
        const totalPriceBeforeDiscount = cart.totalPrice;
        const priceAfterDiscount = (totalPriceBeforeDiscount - (totalPriceBeforeDiscount * validCoupon.value) / 100).toFixed(2);

        // Update the cart with the new priceAfterDiscount
        const updatedCart = await CartModel.findOneAndUpdate(
            { orderBy: req.userid },
            { priceAfterDiscount },
            { new: true }
        );

        res.status(200).json({
            status: "SUCCESS",
            message: "Coupon applied successfully",
            data: {
                totalPriceBeforeDiscount,
                priceAfterDiscount,
                updatedCart
            }
        });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};


export const createOrder = async (req, res) => {
    try {

        if (!req.userid) {
            return res.status(401).json({ status: 'FAIL', data: { message: "You do not have permission to create an order" } });
        }
        const { COD, couponApplied } = req.body;
        if (!COD) {
            return res.status(401).json({ status: "FAIL", data: { message: "Creating cash order failed" } });
        }

        // Logging to check the userCart
        const userCart = await CartModel.findOne({ orderBy: req.userid });

        if (!userCart || !userCart.cart || userCart.cart.length === 0) {
            return res.status(404).json({ status: "FAIL", data: { message: "User cart or products not found" } });
        }

        // Check if userCart.cart is an array before using map
        if (!Array.isArray(userCart.cart)) {
            return res.status(404).json({ status: "FAIL", data: { message: "User cart products not found or not in the expected format" } });
        }
console.log(userCart)
        let finalPrice = 0;
        if (couponApplied && userCart.priceAfterDiscount) {
            finalPrice = userCart.priceAfterDiscount;
        } else {
            finalPrice = userCart.totalPrice;
        }

        let newOrder = await new orderModel({
            products: userCart.cart, // Use userCart.cart instead of userCart.products
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                finalPrice: finalPrice,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderBy: req.userid,
            orderStatus: "Cash on Delivery",
        }).save();

        let update = userCart.cart.map((item) => { // Use userCart.cart instead of userCart.products
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: item.count, sold: +item.count } },
                },
            };
        });

        const updated = await productModel.bulkWrite(update, {});

        res.status(200).json({ status: "SUCCESS", message: "order created successfully"});
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};


export const updateCart = async (req, res) => {
    try {
        if (!req.userid) {
            return res.status(401).json({ status: "FAIL", data: { message: "You do not have permission to update the Cart" } });
        }

        const cartId = req.params.cartId;
        const productIdToUpdate = req.params.productIdToUpdate; 
        const updates = req.body; 

        // Check if the cart exists
        const existingCart = await CartModel.findById(cartId);

        if (!existingCart) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Cart not found' } });
        }

        // Check if the user has permission to update this cart
        if (existingCart.orderBy.toString() !== req.userid) {
            return res.status(403).json({ status: "FAIL", data: { message: 'You do not have permission to update this cart' } });
        }

        // Find the index of the product to update in the cart
        const productIndex = existingCart.cart.findIndex(product => product.product.toString() === productIdToUpdate);

        if (productIndex === -1) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Product not found in the cart' } });
        }

        // Apply partial updates to the specific product
        Object.assign(existingCart.cart[productIndex], updates);

        // Save the updated cart
        const updatedCart = await existingCart.save();

        res.status(200).json({ status: "SUCCESS", message: "Cart updated successfully", data: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};

export const getUserOrder = async (req, res) => {
    try {
        const cart = await orderModel.findOne({ orderBy: req.userid });

        res.status(200).json({ status: "SUCCESS", message: "Get user cart successful", data: cart });
    } catch (error) {
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};
