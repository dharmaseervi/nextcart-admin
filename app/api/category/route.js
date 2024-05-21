import connectDB from "@/lib/mongodbConnect";
import Category from "@/models/category";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const { parentCategory, subCategory } = await request.json();

        // Query for categories with the provided parent category
        let categories = await Category.find({ parent: parentCategory });

        if (categories.length === 0) {
            // If no categories are found, create a new one
            console.log('Creating new category');
            const newCategory = new Category({
                parent: parentCategory,
                subcategories: [subCategory]
            });
            // Save the new category to the database
            await newCategory.save();
        } else {
            // If categories are found, check if the subcategory already exists
            console.log('Adding subcategory');
            const category = categories[0]; // Assuming you're only working with the first category found
            if (!category.subcategories.includes(subCategory)) {
                // Add the subcategory to the existing parent category
                category.subcategories.push(subCategory);
                // Save the changes to the existing category
                await category.save();
            } else {
                // Subcategory already exists, return an error response
                return NextResponse.error(400, "Subcategory already exists");
            }
        }

        console.log('Category added successfully');

        return NextResponse.json({ message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error.message);
        return NextResponse.error(500, 'Failed to add category');
    }
}
