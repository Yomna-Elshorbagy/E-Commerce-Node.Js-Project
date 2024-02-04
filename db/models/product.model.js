import mongoose from "mongoose";

let productSchema = new mongoose.Schema({
    productName:String,
    slug:String,
    ProductPrice : {
        type: Number,
        default:0
    },
    priceAfterDiscount:{
        type:Number,
        default:0},
    discount:{
        type:Number,
        state:0
    },
    productImage: {
        type: String,
        default:''
    },
    category: {
         type: mongoose.Types.ObjectId,
        //   type:String,
          ref: 'Category'
         },
    stock: { 
        type: Number,
        default: 0, 
        min:0,
        max:100},
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps:true
});

const productModel = mongoose.model('product', productSchema);

export default productModel;