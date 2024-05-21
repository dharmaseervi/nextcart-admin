import Layout from '@/app/admin/Layout'
import { deleteProduct, getProduct } from '@/lib/action';
import Link from 'next/link'

export default async function Product() {
  const products = await getProduct();
  const responseJson = JSON.parse(products);
  console.log(responseJson);



  return (
    <Layout >
      <div className='flex flex-col gap-2 h-full '>
        <div>
          <Link href={'/product/addproduct'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>add product</button></Link>
        </div>
        {responseJson ?
          <div className='overflow-y-auto flex flex-col space-y-2 border-t' >
            <table className='border-collapse border border-slate-700 space-x-2'>
              <thead className="bg-blue-700 border  p-2 text-white sticky top-0 z-10">
                <tr className="">
                  <th className="border py-2 ">Product Name</th>
                  <th className="border py-2 ">Product Image</th>
                  <th className="border py-2 ">Product Price</th>
                  <th className="border py-2 ">Product Quantity</th>
                  <th className="border py-2 ">Product category</th>
                  <th className="border py-2 ">action</th>
                </tr>
              </thead>
              {responseJson.map((data, index) =>
                <tbody key={index} >
                  <tr className="text-white bg-slate-700">
                    <td className="border border-black-600 py-2 px-4">{data.productname}</td>
                    <td className="border border-black-600 py-2 px-4">
                      <img className='w-14 h-14 rounded' src={data.photo[0]} alt="" />
                    </td>
                    <td className="border border-black-600 py-2 px-4">{parseFloat(data.productprice).toLocaleString()}</td>
                    <td className="border border-black-600 py-2 px-4">{data.productquantity}</td>
                    <td className="border border-black-600 py-2 px-4">{data.parentcategory}</td>
                    <td className="border border-black-600 py-4 px-4 flex gap-2 ">
                      <Link href={'/product/' + data._id} className=''>
                        <div className='flex bg-blue-500 p-2  text-white font-bold rounded justify-center items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          edit
                        </div>
                      </Link>

                      <form action={deleteProduct}>
                        <input type="hidden" name='id' value={data._id} />
                        <button className='flex bg-red-600 p-2  text-white font-bold rounded justify-center items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          delete
                        </button>
                      </form>

                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div> : <div>Loading...</div>}
      </div>
    </Layout >
  )
}
