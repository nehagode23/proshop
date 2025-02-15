import React from 'react';
import { useState,useEffect } from 'react';
import {Table,Form,Button,Row,Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

    const {userInfo}=useSelector((state)=>state.auth);

    const [updateProfile,{isLoading:loadingUpdateProfile}]=useProfileMutation();
    const {data:orders, isLoading, error}=useGetMyOrdersQuery();

    useEffect(()=>{
        if(!userInfo){
            navigate('/login');
        }
        if(userInfo){
            setEmail(userInfo.email);
            setName(userInfo.name);
        }
    },[userInfo, navigate]);

    const submitHandler=async(e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error('Passwords do not match');
        }else{
            try{
            const res= await updateProfile({_id:userInfo._id,name,email,password}).unwrap();
            dispatch(setCredentials(res));
            toast.success('Profile updated successfully');
            }
            catch(err){
                toast.error(err?.data?.message||err.error);
            }
        }
    }

    const gotodetails=(id)=>()=>{
        navigate(`/order/${id}`);
    }

  return (
    <Row>
        <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}>
               </Form.Control>
             </Form.Group>

             <Form.Group controlId='email' className='my-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}>
               </Form.Control>
             </Form.Group>

             <Form.Group controlId='password' className='my-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}>
               </Form.Control>
             </Form.Group>

             <Form.Group controlId='confirmPassword' className='my-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}>
               </Form.Control>
             </Form.Group>

             <Button type='submit' variant='primary' className='my-2'>
                Update
             </Button>
             { loadingUpdateProfile && <Loader/>}
        </Form>
        </Col>
        <Col md={9}>
        <h2>My Orders</h2>
        {isLoading? (<Loader/>):error? <Message variant='danger'>{error?.data?.message || error.error}</Message>:(
            <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order)=>(
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0,10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>{order.isPaid?order.paidAt.substring(0,10):(
                                <FaTimes style={{color:'red'}}></FaTimes>
                            )}</td>
                            <td>{order.isDelivered?order.deliveredAt.substring(0,10):(
                                <FaTimes style={{color:'red'}}></FaTimes>
                            )}</td>
                            <td>
                                <Button variant='light' className='btn-sm' onClick={gotodetails(order._id)}>Details</Button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
        </Col>
    </Row>
  )
}

export default ProfileScreen