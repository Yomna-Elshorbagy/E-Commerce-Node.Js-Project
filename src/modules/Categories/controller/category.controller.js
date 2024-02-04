
import multer from "multer";
import Categorymodel from "../../../../db/models/category.js";
import {v4 as uuidv4} from 'uuid';
import userModel from "../../../../db/models/user.model.js";
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
export const addimg = upload.single('image');


export const addcategory = async (req, res) => {
    const { categoryName, image } = req.body;
    const createdBy = await userModel.findById(req.body.createdBy)
    const foundedCategory = await Categorymodel.findOne({
        categoryName: categoryName,
      
    });
    if (foundedCategory) return res.send({ message: "category already exists" });
    const newCategory = await Categorymodel.insertMany({
      categoryName,
      image:req.file.filename,
      createdBy,
    });
    res.send({ message: "category created", category: newCategory });
  };

export const getAllCategories = async (req, res) => {
  try {
      const categories = await Categorymodel.find();
      res.json({ categories });
  } catch (error) {
      res.status(500).json({ message: error.message, data: null });
  }
};

export const allcategoriesCreatedByUser = async (req, res) => {
    try {
        const allcateg = await Categorymodel.find({createdBy: req.params.id}).populate("createdBy");
        res.json({message:"ok Done", allcateg})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getCategoryByName = async (req, res) => {
  try {
      const categoryName = req.body.categoryName;

      const category = await Categorymodel.findOne({ categoryName });

      if (category) {
          res.json({ category });
      } else {
          res.status(404).json({ message: 'Category not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message, data: null });
  }
};

export const updateCategoryy = async (req,res)=>{
  let category =await Categorymodel.findOne({categoryName: req.body.categoryName})
  if(category){
    category.image=req.body.image
      await category.save();
      res.json({message:"Updated", category})
  }else{
      res.json({message:"category not found"})
  }
}

// export const updateCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const { categoryName, image } = req.body;
//     const category = await Categorymodel.findById(categoryId);

//     if (!category) {
//       return res.json({ message: "category not found" });
//     }
//     if (category.createdBy == req.createdBy) {
//       await Categorymodel.findByIdAndUpdate(categoryId, {
//         categoryName,
//         image,
//       });
//       const newCategory = await Categorymodel.findById(categoryId);
//       res.send({ newCategory: newCategory });
//     } else {
//       res.send({ message: "Not authorized to update this category" });
//     }
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// };
// // Update category
export const updateCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId;
      const { categoryName, image } = req.body;

      const category = await Categorymodel.findById(categoryId);


      console.log('category:', category);

      if (!category) {
          return res.status(404).json({ status: 'FAIL', data: { message: 'Category not found' } });
      }

      // Check if the logged-in user is the owner of the category or admin
      if (category.createdBy.toString() !== req.userid || req.userRole !=="admin") {
          return res.status(403).json({ status: 'FAIL', data: { message: 'You do not have permission to update this category' } });
      }

      // Update the category
      const updateCategory = await Categorymodel.findOneAndUpdate(
          { _id: categoryId, createdBy: req.userid },
          { $set: { categoryName, image } }, 
          { new: true }
      );

      if (!updateCategory) {
          return res.status(404).json({ status: 'FAIL', data: { message: 'Category not found' } });
      }

      res.status(200).json({ status: 'SUCCESS', data: { updateCategory } });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ status: 'ERROR', message: error.message, data: null });
  }
};

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await Categorymodel.findByIdAndDelete(categoryId);

        if (deletedCategory) {
            res.json({ message: 'Category deleted successfully', category: deletedCategory });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
};




