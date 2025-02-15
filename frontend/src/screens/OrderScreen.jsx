import { Link, useParams } from "react-router-dom";
import { Row,Col,ListGroup, Image,Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice";
import React from 'react';
import { PayPalButtons,usePayPalScriptReducer } from "@paypal/react-paypal-js";

const OrderScreen = () => {
    const {id:orderId} =useParams();

    const {data:order, refetch, isLoading, isError}=useGetOrderDetailsQuery(orderId);

    const {data:paypal, isLoading:loadingPayPal, isError:errorPayPal}=useGetPayPalClientIdQuery();
    const [payOrder, {isLoading:loadingPay}]=usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [{isPending}, paypalDispatch]=usePayPalScriptReducer();

    const {userInfo}=useSelector(state=>state.auth);

    useEffect(()=>{
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
           const loadPayPalScript=async()=>{
            paypalDispatch({type:'resetOptions',
                value:{
                    'client-id':paypal.clientId,
                    currency:'USD',
                }
            });
            paypalDispatch({type:'setLoadingStatus',value:'pending'});
           }
           if(order && !order.isPaid){
            if(!window.paypal){
               loadPayPalScript();
           }
        }
        }

    },[order,paypal,paypalDispatch,errorPayPal,loadingPayPal]);

    async function onApprove(data,actions){
        await actions.order.capture().then(async function(details){ 
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success('Order Paid');
            } catch (error) {
                toast.error(error?.data?.message||'Payment Failed');
            }
        })
    }

    async function onApproveTest(){
        const testDetails = {
            id: "test-payment-id",
            status: "COMPLETED",
            update_time: new Date().toISOString(),
            payer: {
                email_address: "test@example.com"
            }
        };
        await payOrder(orderId, {details:testDetails});
        refetch();
        toast.success('Order Paid');
    }

    function onError(err){
        toast.error(err.message);
    }

    function createOrder(data,actions){
        return actions.order.create({
            purchase_units:[
                {
                    amount:{
                        value:order.totalPrice,
                    }
                }
            ]
        }).then((orderid)=>{return orderid});
    }

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
        toast.success('Order Delivered');
      };

  return (
    isLoading? <Loader/> : isError? <Message variant="danger">{isError.data.message}</Message>:(
        <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p><strong>Name: </strong>{order.user.name}</p>
                    <p><strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                    </p>
                    <p><strong>Address: </strong>{order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}</p>
                    {order.isDelivered? (
                        <Message variant="success">Delivered on {order.deliveredAt}</Message>
                    ):(
                        <Message variant='danger'>Not Delivered</Message>
                    )}
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p><strong>Method: </strong>{order.paymentMethod}</p>
                    {order.isPaid? (
                        <Message variant="success">Paid on {order.paidAt}</Message>
                    ):(
                        <Message variant='danger'>Not Paid</Message>
                    )}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item,index)=>(
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid rounded></Image>
                                </Col>
                                <Col>
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col>
                                {item.qty}x ${item.price}=${item.qty*item.price}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup.Item>
            </ListGroup>
            </Col>
            <Col md={4}>
            <Card>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                        <Row>
                            <Col>SHipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    {/* PAY ORDER AND MARK AS DELIVERED PLACEHOLDER */}
                    {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button>

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
                </ListGroup>
            </Card>
            </Col>
        </Row>
        </>
    )
  )
}

export default OrderScreen