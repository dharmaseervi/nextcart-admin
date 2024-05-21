'use client'
import React, { use, useEffect, useState } from 'react';
import Layout from '../admin/Layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getProduct } from '@/lib/action';



export default function AddCategorys() {
    const [productCategory, setProductCategory] = useState('');
    const [categoryData, setCategoryData] = useState([
        { parent: 'electronics', subcategories: ['mobile', 'laptop', 'tv'] },
        { parent: 'fashion', subcategories: ['clothes', 'shoes', 'accessories'] },
        { parent: 'books', subcategories: ['fiction', 'non-fiction', 'reference'] },
    ]);
    console.log(categoryData);
    const [parentCategory, setParentCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [customParentCategory, setCustomParentCategory] = useState('');
    const [customSubCategory, setCustomSubCategory] = useState('');


    useEffect(() => {
        const productCategoryData = async () => {
            try {
                const products = await getProduct();
                const responseJson = JSON.parse(products);
                setProductCategory(responseJson);
            } catch (error) {
                console.error('Error fetching product category:', error);
            }
        }

        productCategoryData();
    }, []); // Empty
    console.log(productCategory);


    const handleAddCategory = async (e) => {
        e.preventDefault();
        const selectedParentCategory = customParentCategory || parentCategory;
        const selectedSubCategory = customSubCategory || subCategory;

        // Check if the selected parent category already exists in the category data
        const existingParent = categoryData.find(item => item.parent === selectedParentCategory);

        if (existingParent) {
            // Add the new subcategory to the existing parent category
            const updatedCategoryData = categoryData.map(item => {
                if (item.parent === selectedParentCategory) {
                    return {
                        ...item,
                        subcategories: [...item.subcategories, selectedSubCategory]
                    };
                }
                return item;
            });
            setCategoryData(updatedCategoryData);
        } else {
            // Add a new parent category with the new subcategory
            setCategoryData(prevData => [
                ...prevData,
                { parent: selectedParentCategory, subcategories: [selectedSubCategory] }
            ]);
        }

        // Clear form fields after submission
        setParentCategory('');
        setSubCategory('');
        setCustomParentCategory('');
        setCustomSubCategory('');



        try {
            const response = await fetch('/api/category/', { // Updated endpoint to match the folder structure
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ parentCategory: selectedParentCategory, subCategory: selectedSubCategory })
            });

            if (response.ok) {
                // Category added successfully
                const data = await response.json();
                console.log('Category added:', data);
            } else {
                // Failed to add category
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error.message);
        }

    }




    const handleParentChange = (e) => {
        setParentCategory(e.target.value);
        setSubCategory(''); // Clear subcategory when parent category changes
    }


    return (
        <Layout>
            <div className="flex  flex-col gap-2  h-screen overflow-auto  p-2">
                <form onSubmit={handleAddCategory} className='flex gap-2 border p-2 bg-slate-900   w-full'>
                    <div className="flex gap-2 flex-col w-full">
                        <Label htmlFor="parentCategory">Parent Category Name</Label>
                        <select
                            name="parentCategory"
                            id="parentCategory"
                            className='p-2 w-full rounded bg-transparent border border-slate-700 text-white'
                            value={parentCategory}
                            onChange={handleParentChange}
                        >
                            <option value="">Select Parent Category</option>
                            {categoryData.map((item, index) => (
                                <option key={index} value={item.parent}>{item.parent}</option>
                            ))}
                        </select>
                        <Input
                            type="text"
                            value={customParentCategory}
                            onChange={(e) => setCustomParentCategory(e.target.value)}
                            placeholder="Enter New Parent Category"
                            className="text-white"
                        />
                    </div>
                    <div className="flex gap-2 flex-col w-full">
                        <Label htmlFor="subCategory">Sub Category Name</Label>
                        <select
                            name="subCategory"
                            id="subCategory"
                            className='p-2 w-full rounded bg-transparent border border-slate-700 text-white'
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                        >
                            <option value="">Select Subcategory</option>
                            {parentCategory &&
                                categoryData.find(item => item.parent === parentCategory)?.subcategories.map((subcategory, index) => (
                                    <option key={index} value={subcategory}>{subcategory}</option>
                                ))
                            }
                        </select>
                        <Input
                            type="text"
                            value={customSubCategory}
                            onChange={(e) => setCustomSubCategory(e.target.value)}
                            placeholder="Enter New Subcategory"
                            className="text-white"
                        />
                    </div>
                    <div className="">
                        <Button type="submit">Add Category</Button>
                    </div>
                </form>
                <div>
                    {productCategory ?
                        <table className='border-collapse border border-slate-700 space-x-2 w-full'>
                            <thead className="bg-blue-700 border text-white">
                                <tr className="">
                                    <th className="border py-2 ">product image</th>
                                    <th className="border py-2 ">Product Category</th>
                                    <th className="border py-2 ">Product Subcategory</th>
                                    <th className="border py-2 ">Product Brand</th>
                                </tr>
                            </thead>
                            {productCategory.map((data, index) =>
                                <tbody key={index} >
                                    <tr className="text-white bg-slate-700">
                                        <td className="border border-black-600 py-2 px-4">
                                            <img className='w-14 h-14 rounded' src={data.photo[0]} alt="" />
                                        </td>
                                        <td className="border border-black-600 py-2 px-4">{data.parentcategory}</td>
                                        <td className="border border-black-600 py-2 px-4">{data.subcategory}</td>
                                        <td className="border border-black-600 py-2 px-4">{data.productbrand}</td>
                                    </tr>
                                </tbody>
                            )}
                        </table> : <div>Loading...</div>}
                </div>
            </div>

        </Layout>
    );
}
