import { Pagination } from "react-bootstrap";
import Button from "react-bootstrap";

import React from 'react'
import { useNavigate } from "react-router-dom";

const Paginate = ({pages,page,isAdmin=false}) => {

    const navigate=useNavigate();

    const gotoPage=(e)=>{
        if(!isAdmin){
            navigate(`/page/${e}`);
        }
        else{
            navigate(`/admin/productlist/${e}`);
        }

    }
  return (
    pages>1&&(
        <Pagination>
            {[...Array(pages).keys()].map((x)=>(
            
                <Pagination.Item active={x+1===page}>
                <a onClick={() => gotoPage(x + 1)} variant='light'>
                {x+1}
                </a>
                </Pagination.Item>
            
            ))}
        </Pagination>
    )
  )
}

export default Paginate