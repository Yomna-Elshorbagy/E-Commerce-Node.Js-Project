
import mongoose from "mongoose";



let categorySchema = new mongoose.Schema({
  categoryName: {
     type: String, 
     required: true },
  image: String,
  createdBy: { 
     type: mongoose.Types.ObjectId,
     ref: 'user' },
});

const Categorymodel = mongoose.model('Category', categorySchema);

export default Categorymodel;