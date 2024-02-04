
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    priceAfterDiscount: {
        type: Number,
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            count: {
                type: Number,
                default: 1,
            },
            price:{
                type: Number,
                ref: 'product',
            }

        },{
            timestamps:true
        }
    ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
