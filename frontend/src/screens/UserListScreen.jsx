import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { FaTrash, FaTimes, FaEdit, FaCheck } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../slices/userApiSlice';
import { Table } from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserListScreen = () => {

    const navigate=useNavigate();
    const {data:users,refetch, isLoading, error}=useGetUsersQuery();
    const [deleteUser, {isLoading:loadingDelete}]=useDeleteUserMutation();

    const deleteHandler=async(id)=>{
        if(window.confirm('Are you sure?')){
            try {
                await deleteUser(id);
                refetch();
            } catch (error) {
                toast.error(error?.data?.message||error.error);
            }
        }
    }

    const gotodetails=(id)=>()=>{
        navigate(`/admin/user/${id}/edit`);
    }
  return (
    <>
    <h1>Users</h1>
    {loadingDelete && <Loader/>}
    {isLoading?<Loader/>:error?<Message variant='danger'>{error}</Message>:
    (
        <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {users.map((user)=>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin? (<FaCheck style={{color:'green'}}/>):(<FaTimes style={{color:'red'}}/>)}</td>
                        <td>
                            
                                <Button variant='light' className='btn-sm' onClick={gotodetails(user._id)}>
                                    <FaEdit/>
                                </Button>
                                <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(user._id)}>
                                    <FaTrash style={{color:'white'}}/>
                                </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )}
    </>
  )
}

export default UserListScreen