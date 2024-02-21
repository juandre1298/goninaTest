import { useState, useEffect } from "react";
import {
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} from "../api/apiSlice";

const OrderDetails = () => {
  const [orderId, setOrderId] = useState("1");
  const { data, error, isLoading, refetch } = useGetOrderQuery(orderId);
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    if (error) {
      createOrderIfNotExists();
    }
  }, [error]);

  const [createOrder] = useCreateOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const createOrderIfNotExists = async () => {
    try {
      await createOrder({
        id: orderId,
        status: "PAID",
        amount: 10.32,
        currency: "EUR",
      });
      await refetch();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await cancelOrder(orderId);
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeleted(false);
    const newOrderId = e.target.elements.id.value.trim();
    if (newOrderId) {
      setOrderId(newOrderId);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Order Details</h1>
      <p className="description">
        Hello! This function will retrieve the details of any order you request
        via the input field. If the order doesn't exist, it will be created
        automatically. Additionally, you can delete an existing order by
        clicking the 'Delete' button.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="id" className="input" />
        <button type="submit" className="button">
          Get Order
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && !deleted ? (
        <div className="order-container">
          <p>Order ID: {data.order.id}</p>
          <p>Status: {data.order.status}</p>
          <p>Amount: {data.order.amount}</p>
          <p>Currency: {data.order.currency}</p>
          <button onClick={handleDeleteOrder} className="delete-button">
            Delete Order
          </button>
        </div>
      ) : (
        <div className="deleted-order-container">
          <p>Order ID: {orderId} deleted</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
