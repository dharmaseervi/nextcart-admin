'use server';
import connectDB from "./mongodbConnect";
import Category from "@/models/category";

export async function AddCategory(formData) {
    'use server'
    try {
        await connectDB();

        const parentCategory = formData.get('parentCategory');
        const subCategory = formData.get('subCategory');
        console.log('Parent category:', parentCategory);
        console.log('Subcategory:', subCategory);

        console.log(formData, 'formData');

        let category = await Category.findOne({ parent: parentCategory });

        if (!category) {
            // If parent category doesn't exist, create a new one
            category = new Category({
                parent: parentCategory,
                subcategories: [subCategory]
            });
        } else {
            // If parent category exists, add the subcategory to it
            category.subcategories.push(subCategory);
            // Save the changes to the existing category
            await category.save();
        }

        console.log('Category added successfully', category);
        return category;
    } catch (error) {
        console.error('Error adding category:', error.message);
        throw new Error('Failed to add category');
    }
}

export async function GetCategories() {
    'use server'
    try {
        await connectDB();
        const categories = await Category.find();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        throw new Error('Failed to fetch categories');
    }
}