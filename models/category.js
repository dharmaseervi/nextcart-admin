import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    parent: { type: String, required: true },
    subcategories: [String]
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
