'use client'
import Layout from '@/app/admin/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateProduct, UplodaPhoto, deletePhoto, fetchProduct } from '@/lib/action';
import { GetCategories } from '@/lib/categoryaction';
import { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';


export default function EditProduct({ params }) {
  const { editproductid } = params;
  const [variants, setVariants] = useState([]);
  const [productData, setProduct] = useState({});
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  console.log(variants, "variants");
  console.log(parentCategory, "parentCategory");
  console.log(subCategory, "subCategory");
  const fetchProductData = async () => {
    try {
      const response = await fetchProduct(editproductid);
      const responseJson = JSON.parse(response);
      console.log('response:', responseJson);
      setProduct(responseJson);
      setParentCategory(responseJson.parentcategory || '');
      setVariants(responseJson.variants || []);
      setValue('productname', responseJson.productname || ''); // Set product name
      setValue('productbrand', responseJson.productbrand || ''); // Set product brand
      setValue('productdescription', responseJson.productdescription || ''); // Set product description
      setValue('price', responseJson.productprice || ''); // Set product price
      setValue('mrpprice', responseJson.productmrpprice || ''); // Set product price
      setValue('quantity', responseJson.productquantity || ''); // Set product quantity
      setValue('weight', responseJson.weight || ''); // Set product weight
      setValue('height', responseJson.height || ''); // Set product height
      setValue('width', responseJson.width || ''); // Set product width
      setValue('parentCategory', responseJson.parentcategory || ''); // Set parent category
      setValue('subCategory', responseJson.subcategory || ''); // Set subcategory


      // Set previews if available
      if (responseJson.photo && Array.isArray(responseJson.photo)) {
        setPreviews(responseJson.photo.map((imageUrl, index) => ({
          imageUrl,
          photoKey: responseJson.photoKeys && responseJson.photoKeys[index] ? responseJson.photoKeys[index] : ''
        })));
      }


    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
  useEffect(() => {
    fetchProductData();
  }, []);

  console.log(`productData:`, productData);
  const fetchCategories = async () => {
    try {
      const response = await GetCategories();

      setCategory(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    const urlsAndKeys = await Promise.all(files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const data = await UplodaPhoto(formData);

        // Add the object with imageUrl and photoKey to the previews array
        return { imageUrl: data[0].imageUrl, photoKey: data[0].photoKey };
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    }));

    // Filter out null values and add valid previews to the state
    const validPreviews = urlsAndKeys.filter(data => data !== null);
    setPreviews((prevPreviews) => [...prevPreviews, ...validPreviews]);
  };


  const handleCancelUpload = async (index, photoKey) => {
    const updatedPreviews = [...previews];
    console.log('photo updated key:', updatedPreviews);
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
    if (!photoKey) {
      console.error('Invalid photoKey:', photoKey);
      return;
    }
    try {
      console.log('photokey:', photoKey);
      await deletePhoto(photoKey);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('productid', productData._id);
    formData.append('productname', data.productname);
    formData.append('productbrand', data.productbrand);
    formData.append('productdescription', data.productdescription);
    formData.append('price', data.price);
    formData.append('mrpprice', data.mrpprice);
    formData.append('quantity', data.quantity);
    formData.append('weight', data.weight);
    formData.append('height', data.height);
    formData.append('width', data.width);
    formData.append('parentCategory', parentCategory);
    formData.append('subCategory', subCategory);
    previews.forEach((preview, index) => {
      formData.append(`preview_${index}`, preview.imageUrl);
      formData.append(`photoKey_${index}`, preview.photoKey);
    });

    variants.forEach((variant, index) => {
      formData.append(`variant_${index}_name`, variant.name);
      formData.append(`variant_${index}_value`, variant.value);
    });

    console.log('formData:', formData);
    await UpdateProduct(formData);
  };

  const handleParentChange = (e) => {
    const selectedParentCategory = e.target.value;
    setParentCategory(selectedParentCategory);
    // Find the selected parent category from the fetched categories
    const selectedCategory = category.find(category => category.parent === selectedParentCategory);
    if (selectedCategory) {
      setSubCategories(selectedCategory.subcategories);
    } else {
      setSubCategories([]);
    }
    setSubCategory('');
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', value: '' }]);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-4 gap-2 gird-wrap overflow-auto h-full '>
        <div className='col-span-4 grid grid-cols-4 gap-2 border p-2 rounded'>
          <Input type="hidden" {...register('productid')} value={productData._id} />

          <div className='col-span-2'>
            <Label>Product Name</Label>
            <Input {...register("productname", { required: true })} />
            {errors.name && <span>Name is required and must be at least 3 characters long</span>}
          </div>
          <div className='col-span-2'>
            <Label>Product Brand</Label>
            <Input {...register("productbrand", { required: true })} />
            {errors.description && <span>Description is required and must be at least 10 characters long</span>}
          </div>
          <div className='col-span-4'>
            <Label>Product Description</Label>
            <Textarea {...register("productdescription", { required: true })} />
            {errors.description && <span>Description is required and must be at least 10 characters long</span>}
          </div>
        </div>
        <div className='col-span-4 border p-2 rounded'>
          <div className='flex justify-start  gap-1'>
            <Label htmlFor="image" className='justify-center items-center border border-dashed	 flex w-32 h-32 text-white font-serif font-medium'>
              upload image
              <Input type="file" name="image" id="image" accept='images/*' multiple className='hidden' onChange={handleImageChange} />
            </Label>
            {previews.map((preview, index) => (
              <div key={index} className='w-32 h-32 flex justify-center flex-col border border-slate-600 '>

                <input type="hidden" {...register(`image[${index}].imageUrl`)} value={preview.imageUrl} />
                <input type="hidden" {...register(`image[${index}].photoKey`)} value={preview.photoKey} />

                <img src={preview.imageUrl} className='h-full w-full' alt={`Preview ${index}`} />
                <button className='bg-red-600 w-full p-1 text-white font-xl font-medium font-serif' onClick={() => handleCancelUpload(index, preview.photoKey)} >Remove</button>
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-2 border p-2 rounded'>
          <div>
            <Label>Mrp Price</Label>
            <Input type="number" {...register("mrpprice", { required: true })} />
            {errors.price && <span className='text-red-700'> Price is required and must be a number</span>}
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" {...register("price", { required: true })} />
            {errors.price && <span>Price is required and must be a number</span>}
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" {...register("quantity", { required: true })} />
            {errors.quantity && <span>Quantity is required and must be a number</span>}
          </div>
        </div>
        <div className='col-span-2 border p-2 rounded'>
          <div>
            <Label>Weight</Label>
            <Input type="number" {...register("weight", { required: true })} />
          </div>
          <div>
            <Label>Height</Label>
            <Input type="number" {...register("height", { required: true })} />

          </div>
          <div>
            <Label>Width</Label>
            <Input type="number" {...register("width", { required: true })} />
          </div>
        </div>
        <div className='col-span-4 border p-2 rounded'>
          <div className="flex gap-2 flex-col">
            <Label htmlFor="parentCategory">Parent Category Name</Label>
            <select
              name="parentCategory"
              id="parentCategory"
              className='p-2 w-full rounded'
              value={parentCategory}
              onChange={handleParentChange}

            >
              <option value="">Select Parent Category</option>
              {category.map((category, index) => (
                <option key={index} value={category.parent} >{category.parent}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="subCategory">Sub Category Name</Label>
            <select
              name="subCategory"
              id="subCategory"
              className='p-2 w-full rounded'
              value={subCategory || productData.subcategory}
              onChange={handleSubCategoryChange}
            >
              <option value="">Select Subcategory</option>
              {subCategories.map((subcategory, index) => (
                <option key={index} value={subcategory}  >{subcategory}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='col-span-4 border p-2 rounded'>
          <div className="flex gap-2 flex-col">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2 m-2">
                <Input
                  type="text"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  placeholder="Variant Name"
                />
                <Input
                  type="text"
                  value={variant.value}
                  onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
                  placeholder="Variant Value"
                />
                <Button type="button" onClick={() => handleRemoveVariant(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" className='m-2' onClick={handleAddVariant}>Add Variant</Button>
          </div>
        </div>
        <div className='col-span-4'>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Layout>
  );
}
