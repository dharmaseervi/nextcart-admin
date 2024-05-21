import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productname: { type: String, required: true },
    productbrand: { type: String, required: true },
    productdescription: { type: String, required: true },
    photo: [{ type: String, required: true }],
    photoKeys: [{ type: String, required: true }],
    productprice: { type: Number, required: true },
    productmrpprice: { type: Number, required: true },
    productquantity: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    parentcategory: { type: String, required: true },
    subcategory: { type: String, required: true },
    photo: [{ type: String, required: true }],
    photoKeys: [{ type: String, required: true }],
    variants: [{ name: String, value: String }],

});

// Check if the model is already defined, and if not, define it
const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
