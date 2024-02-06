import mongoose from "mongoose";


let couponschema = new mongoose.Schema({
    couponCode:{
        type:String,
        required: [true, 'Coupon name requied']
    },
    value: {
        type:Number,
        required: [true, "Coupon discount value requied"]
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    updatedBy:{
        type: mongoose.Types.ObjectId,
        ref:"user"
    },
    deletedBy:{
        type: mongoose.Types.ObjectId,
        ref:"user",
        default: null
    },
    expireIn:{
        type:Date,
        required: [true, "Coupon expire time requied"]
    }

},{
    timestamps:true
});

const couponModel = mongoose.model('coupon', couponschema);
export default couponModel;