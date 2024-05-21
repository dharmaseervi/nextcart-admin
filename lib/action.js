'use server'
import connectDB from "./mongodbConnect";
import ProductModel from "@/models/products";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { S3Client, PutObjectCommand, DeleteObjectCommand, } from "@aws-sdk/client-s3";


//function to upload photo to s3 bucket
export async function UplodaPhoto(formData) {
    await connectDB();
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
    });

    const images = formData.getAll('image');
    console.log(images, 'images');

    const uploadImageTasks = images.map(async (file) => {
        try {
            let fileBuffer;
            // Determine the format of the file data and handle accordingly
            if (file instanceof Blob) {
                // If file data is in Blob format, read into ArrayBuffer
                const fileArrayBuffer = await file.arrayBuffer();
                fileBuffer = Buffer.from(fileArrayBuffer);
            } else if (file instanceof ArrayBuffer) {
                // If file data is already in ArrayBuffer format
                fileBuffer = Buffer.from(file);
            } else {
                // Handle other formats or throw an error
                throw new Error('Unsupported file data format');
            }
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: Date.now() + file.name,
                Body: fileBuffer,
                ContentType: 'image/jpg',
            };

            await s3.send(new PutObjectCommand(params));
            const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;

            console.log("File uploaded successfully");
            console.log(imageUrl, params.Key);
            return { imageUrl, photoKey: params.Key };
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    });

    const imageUrls = await Promise.all(uploadImageTasks);
    console.log(imageUrls);
    return imageUrls.filter(url => url !== null);
}

//function to delete photo from s3 bucket
export async function deletePhoto(photoKey) {
    try {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
        });

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: photoKey // Pass the photoKey as the Key parameter
        };

        await s3.send(new DeleteObjectCommand(params));
        console.log("File deleted successfully");
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}


//post method to add product
export async function addProduct(formData) {
    await connectDB();
    console.log(formData, 'formData');


    const variantArray = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('variant')) {
            const index = parseInt(key.match(/\[(\d+)\]/)[1]); // Extract the index from the key
            const prop = key.endsWith('.name') ? 'name' : 'value'; // Determine whether it's the name or value
            variantArray[index] = variantArray[index] || {}; // Initialize object if not exists
            variantArray[index][prop] = value;
        }
    }

    // Extract image URLs from the form data
    console.log(variantArray, 'variantArray');
    const imageUrlArray = [];
    const photoKeyArray = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('preview_')) {
            imageUrlArray.push(value);
        } else if (key.startsWith('photoKey_')) {
            photoKeyArray.push(value);
        }
    }
    try {
        // Create a new product with image URLs
        const newProductModel = new ProductModel({
            productname: formData.get('productname'),
            productbrand: formData.get('productbrand'),
            productdescription: formData.get('productdescription'),
            productprice: formData.get('price'),
            productmrpprice: formData.get('mrpprice'),
            productquantity: formData.get('quantity'),
            width: formData.get('width'),
            height: formData.get('height'),
            weight: formData.get('weight'),
            estimateddelivery: formData.get('estimatedDeliveryTime'),
            parentcategory: formData.get('parentCategory'),
            subcategory: formData.get('subCategory'),
            photo: imageUrlArray,
            photoKeys: photoKeyArray,
            variants: variantArray,

        });
        // console.log('New Product Model:', newProductModel);
        // Save the new product
        await newProductModel.save();
        // console.log('Product saved successfully');
    } catch (error) {
        console.error('Error saving product:', error);
        console.log('Product not saved');
    }
    revalidatePath("/product");
    redirect("/product");
}

//put method to update product
// export async function UpdateProduct(formData) {
//     'use server'
//     console.log(formData, 'hello formData');
//     await connectDB();
//     const id = formData.get('productid');

//     const imageUrlArray = [];
//     const photoKeyArray = [];
//     for (const [key, value] of formData.entries()) {
//         if (key.startsWith('preview_')) {
//             imageUrlArray.push(value);
//         } else if (key.startsWith('photoKey_')) {
//             photoKeyArray.push(value);
//         }
//     }
//     try {

//         const newProductModel = new ProductModel({
//             productname: formData.get('productname'),
//             productbrand: formData.get('productbrand'),
//             productdescription: formData.get('productdescription'),
//             productprice: formData.get('price'),
//             productquantity: formData.get('quantity'),
//             width: formData.get('width'),
//             height: formData.get('height'),
//             weight: formData.get('weight'),
//             estimateddelivery: formData.get('estimatedDeliveryTime'),
//             parentcategory: formData.get('parentCategory'),
//             subcategory: formData.get('subCategory'),
//             photo: imageUrlArray,
//             photoKeys: photoKeyArray,

//         });

//         console.log('New Product Model:', newProductModel);

//         Object.keys(newProductModel).forEach((key) => {
//             if (newProductModel[key] === "" || newProductModel[key] === undefined) {
//                 delete newProductModel[key];
//             }
//         });


//         await ProductModel.findOneAndUpdate({ _id: id }, newProductModel, { new: true });
//         console.log('Product updated successfully', newProductModel, { id });


//         console.log('Product updated successfully:', updatedProduct);

//     } catch (error) {
//         console.error('Error updating product:', error);
//         console.log('Product not updated');

//     }
//     revalidatePath("/product");
//     redirect("/product");
// }

export async function UpdateProduct(formData) {
    'use server'
    console.log(formData, 'hello formData');
    await connectDB();
    const id = formData.get('productid');


    const variantArray = [];
    for (const [key, value] of formData.entries()) {
        const match = key.match(/variant_(\d+)_(name|value)/); // Extract the index and property from the key
        if (match) {
            const index = parseInt(match[1]); // Extract the index from the matched groups
            const prop = match[2]; // Extract the property (name or value) from the matched groups
            variantArray[index] = variantArray[index] || {}; // Initialize object if not exists
            variantArray[index][prop] = value;
        }
    }

    const imageUrlArray = [];
    const photoKeyArray = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('preview_')) {
            imageUrlArray.push(value);
        } else if (key.startsWith('photoKey_')) {
            photoKeyArray.push(value);
        }
    }
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
            productname: formData.get('productname'),
            productbrand: formData.get('productbrand'),
            productdescription: formData.get('productdescription'),
            productprice: formData.get('price'),
            productmrpprice: formData.get('mrpprice'),
            productquantity: formData.get('quantity'),
            width: formData.get('width'),
            height: formData.get('height'),
            weight: formData.get('weight'),
            estimateddelivery: formData.get('estimatedDeliveryTime'),
            parentcategory: formData.get('parentCategory'),
            subcategory: formData.get('subCategory'),
            photo: imageUrlArray,
            photoKeys: photoKeyArray,
            variants: variantArray,
        }, { new: true });

        console.log('Product updated successfully:', updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        console.log('Product not updated');
    }
    revalidatePath("/product");
    redirect("/product");
}


//get method to fetch product by id
export async function fetchProduct(id) {
    'use server'
    try {
        await connectDB();
        const product = await ProductModel.findById(id);
        console.log('Product fetched successfully', product);
        return JSON.stringify(product);

    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}



// get method to fetch all products
export async function getProduct() {
    'use server'
    await connectDB();

    try {
        const products = await ProductModel.find({});
        return JSON.stringify(products);

    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

// delete method to delete product

export async function deleteProduct(formData) {
    'use server'
    await connectDB();
    const { id } = Object.fromEntries(formData);
    console.log(formData, 'hello formData');
    try {
        const productId = new mongoose.Types.ObjectId(id);
        await ProductModel.findByIdAndDelete(productId);
        console.log('Product deleted successfully', productId);
    } catch (error) {
        console.error('Error deleting product:', error);
    }
    revalidatePath("/product");

}



