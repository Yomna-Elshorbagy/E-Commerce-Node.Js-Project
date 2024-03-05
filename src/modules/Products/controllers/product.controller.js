import multer from "multer";
import productModel from "../../../../db/models/product.model.js";
import {v4 as uuidv4} from 'uuid';
import Categorymodel from "../../../../db/models/category.js";
uuidv4();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '_' + file.originalname);
    },
});
const upload = multer({ storage: storage });
export const image = upload.single('productImage')

export const addProduct = async (req, res) => {
    try {
        const existingProduct = await productModel.findOne({ productName: req.body.productName });

        if (existingProduct) {
            return res.status(400).json({ status: "FAIL", data: { message: "A product with the same name already exists" } });
        }
        if (req.userid !== req.body.createdBy) {
            return res.status(401).json({ status: "FAIL", data: { message: "You do not have permission to add product" } });
        }

        const price = req.body.ProductPrice; 
        const discount = req.body.discount; 

        // Calculate the price after discount
        const priceAfterDiscount = discount ? price - (price * (discount / 100)) : price;
         // Check if the category exists
        const existingCategory = await Categorymodel.findById(req.body.category);
        if (!existingCategory) {
        return res.status(404).json({ status: "FAIL", data: { message: 'Category not found' } });
        }
        const product = new productModel({
            productName: req.body.productName,
            ProductPrice: req.body.ProductPrice,
            discount: discount,
            priceAfterDiscount: priceAfterDiscount,
            productImage: "http://localhost:5000/uploads/" + req.file.filename,
            category: req.body.category,
            // createdBy: req.body.createdBy,
            createdBy: req.userid,
            stock:req.body.stock,
        });

        await product.save();

        res.status(201).json({ status: { message: "Product added successfully", product } });
    } catch (error) {
        res.status(500).json({ status: error.message, data: null });
    }
};
//////////////////////////////////////////////////////////////
// update product
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, productImage, discount, productPrice } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Product not found' } });
        }

        // Check if the logged-in user is the owner of the product or admin
        if (product.createdBy.toString() !== req.userid || req.userRole!== "admin") {
            return res.status(403).json({ status: "FAIL", data: { message: 'You do not have permission to update this product' } });
        }

        // Ensure productPrice is a valid number
        const newProductPrice = typeof productPrice === 'number' ? productPrice : product.ProductPrice;

        // Ensure discount is a valid number
        const newDiscount = typeof discount === 'number' ? discount : product.discount;

        // Check if both productPrice and discount are valid numbers
        if (typeof newProductPrice !== 'number' || typeof newDiscount !== 'number') {
            return res.status(400).json({ status: "FAIL", data: { message: 'Invalid values for productPrice or discount' } });
        }

        // Calculate the price after discount
        const newPriceAfterDiscount = newProductPrice - (newProductPrice * (newDiscount / 100));

        // Update the product
        const updateProduct = await productModel.findOneAndUpdate(
            { _id: productId, createdBy: req.userid },
            {
                $set: {
                    productName,
                    productImage,
                    discount: newDiscount,
                    productPrice: newProductPrice,
                    priceAfterDiscount: newPriceAfterDiscount,
                },
            },
            { new: true }
        );

        if (!updateProduct) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Product not found' } });
        }

        res.status(200).json({ status: "SUCCESS", data: { updateProduct } });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};
////////////////////////////////////////////////////////////////
// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (deletedProduct) {
            res.json({ message: 'Product deleted successfully', product: deletedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
};
////////////////////////////////////////////////////////////////
// Get a specific product by ID
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await productModel.findById(productId);

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
};
///////////////////////////////////////////////////////////////
// Get all products with pagination
export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const products = await productModel.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
};
///////////////////////////////////////////////////////////////
// Get all products in the same category
export const getProductsByCategory = async (req, res) => {
   try{
     const { category } = req.body;
    const theCategory = await Categorymodel.findOne({ categoryName: category });
    if (!theCategory) {
      return res.send({ message: "this category does not exist" });
    } else {
      const products = await productModel.find({ category: theCategory._id }).populate("category");
      res.send({ category: category, data: products });
    }
    }catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const updateProductt = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { stock, discount, productPrice } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Product not found' } });
        }

        // Ensure productPrice is a valid number
        const newProductPrice = typeof productPrice === 'number' ? productPrice : product.ProductPrice;

        // Ensure discount is a valid number
        const newDiscount = typeof discount === 'number' ? discount : product.discount;

        // Check if both productPrice and discount are valid numbers
        if (typeof newProductPrice !== 'number' || typeof newDiscount !== 'number') {
            return res.status(400).json({ status: "FAIL", data: { message: 'Invalid values for productPrice or discount' } });
        }

        // Calculate the price after discount
        const newPriceAfterDiscount = newProductPrice - (newProductPrice * (newDiscount / 100));

        // Update the product
        const updateProduct = await productModel.findOneAndUpdate(
            { _id: productId, createdBy: req.userid },
            {
                $set: {
                    stock,
                },
            },
            { new: true }
        );

        if (!updateProduct) {
            return res.status(404).json({ status: "FAIL", data: { message: 'Product not found' } });
        }

        res.status(200).json({ status: "SUCCESS", data: { updateProduct } });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ status: "ERROR", message: error.message, data: null });
    }
};