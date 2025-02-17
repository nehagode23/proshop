import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetProductsQuery,useCreateProductMutation, useDeleteProductMutation } from '../slices/productsApiSlice';
import { Table, Button, Row,Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';


const ProductListScreen = () => {
    const navigate=useNavigate();
    const {pageNumber}=useParams();
    const {data, isLoading, error,refetch}=useGetProductsQuery({pageNumber});
    const [createProduct,{isLoading:loadingCreate}]=useCreateProductMutation();
    const [deleteProduct, {isLoading:loadingDelete}]=useDeleteProductMutation();

    const deleteHandler=async(id)=>{
        if(window.confirm('Are you sure you want to delete product?')){
            try {
                await deleteProduct(id);
                toast.success('Product Deleted');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message||'Failed to delete product');
            }
        }
    }

    const createProductHandler=async()=>{
        if(window.confirm('Are you sure you want to create a product?')){
           try {
               await createProduct();
               refetch();
           } catch (error) {
                toast.error(error?.data?.message||'Failed to create product');
        }
    }
    }

  return (
    <>
    <Row className='align-items-center'>
        <Col>
            <h1>Products</h1>
            
        </Col>
        <Col>
        <Button className='btn-sm m-3' onClick={createProductHandler}><FaEdit/>Create Product</Button>
        </Col>
    </Row>
    {loadingCreate&&<Loader/>}
    {loadingDelete&&<Loader/>}
    {isLoading?<Loader/>:error?<Message variant='danger'>{error?.data?.message||error.error}</Message>:(
        <>
        <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>BRAND</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.products.map((product)=>(
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                            <Button variant='light' className='btn-sm mx-2' onClick={()=>navigate(`/admin/product/${product._id}/edit`)}>
                                <FaEdit/>
                            </Button>
                            <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(product._id)}>
                                <FaTrash/>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
        </>
    )}
    </>
  )
}

export default ProductListScreen