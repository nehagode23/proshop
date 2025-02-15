import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetProductsQuery,useCreateProductMutation } from '../slices/productsApiSlice';
import { Table, Button, Row,Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';


const ProductListScreen = () => {
    const navigate=useNavigate();
    const {data:products, isLoading, error,refetch}=useGetProductsQuery();
    const [createProduct,{isLoading:loadingCreate}]=useCreateProductMutation();

    const deleteHandler=(id)=>{
        if(window.confirm('Are you sure')){
            //delete products
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
                {products.map((product)=>(
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
        </>
    )}
    </>
  )
}

export default ProductListScreen