import axios from "axios";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "./AuthContext";

// import { io } from "socket.io-client";
export const CustomHookContext = createContext();

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("🚀 ~ file: useHooks.jsx:13 ~ ContextProvider ~ user:", user);
  const [, setAllOrders] = useState([]);
  const [newOrder, setNewOrder] = useState([]);
  const [packagingOrder, setpackagingOrder] = useState([]);
  const [shipmentOrder, setshipmentOrder] = useState([]);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [successfulOrder, setSuccessfulOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  // const socket = io(`${import.meta.env.VITE_APP_SECRET_SERVER_SIDE}/mew-order`);
  ///product

  // ------------------------------------------------------- Order -----------------------------------------//

  //  -----------------------------------------GET ALL ORDERS --------------------------//
  useEffect(() => {
    const url = `${import.meta.env.VITE_APP_SECRET_SERVER_SIDE}/order`;
    setLoading(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        let orderData = response?.data;
        setAllOrders(orderData);
        // filtering for order ststus wise//

        const newOrderData = orderData.filter(
          (item) => item.status === "processing"
        );
        setNewOrder(newOrderData);
        const packagingOrderData = orderData.filter(
          (item) => item?.status === "packaging"
        );
        setpackagingOrder(packagingOrderData);
        const shipmentOrderData = orderData.filter(
          (item) => item?.status === "shipment"
        );
        setshipmentOrder(shipmentOrderData);
        const cancelledOrderData = orderData.filter(
          (item) => item?.status === "cancelled"
        );
        setCancelledOrder(cancelledOrderData);
        const succesfulOrderData = orderData.filter(
          (item) => item?.status === "successful"
        );
        setSuccessfulOrder(succesfulOrderData);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  //  ----------------------------------------Order Status Change ----------------------------//
  const orderStatus = async (id, body) => {
    console.log("🚀 ~ file: useHooks.jsx:67 ~ orderStatus ~ body:", body);
    try {
      const url = `${import.meta.env.VITE_APP_SECRET_SERVER_SIDE}/order/${id}`;
      const response = await axios.put(url, body, {
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.data) {
        setTimeout(() => {
          toast.success("Order Status Change", {
            position: "top-center",
          });
        }, 500);
      }
      if (response && body?.status === "packaging") {
        setNewOrder((data) => data.filter((item) => item._id !== id));
        setpackagingOrder([...packagingOrder, response?.data]);
      }
      if (response && body?.status === "shipment") {
        setpackagingOrder((data) => data.filter((item) => item._id !== id));
        setshipmentOrder([...shipmentOrder, response?.data]);
      }
      if (response && body?.status === "cancelled") {
        setpackagingOrder((data) => data.filter((item) => item?._id !== id)) ||
          setNewOrder((data) => data.filter((item) => item?._id !== id)) ||
          setshipmentOrder((data) => data.filter((item) => item?._id !== id));
        setCancelledOrder([...cancelledOrder, response?.data]);
      }
      if (response && body?.status === "successful") {
        setshipmentOrder((data) => data.filter((item) => item._id !== id));
        setSuccessfulOrder([...successfulOrder, response?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //---------------------------------------Delivery Info --------------------------------

  useEffect(() => {
    const url = `${import.meta.env.VITE_APP_SECRET_SERVER_SIDE}/delivery/${
      user?.email
    }`;
    setLoading(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const deliveryInfo = response?.data;
        setDeliveryInfo(deliveryInfo);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user?.email]);
  return (
    <CustomHookContext.Provider
      value={{
        loading,
        newOrder,
        packagingOrder,
        shipmentOrder,
        cancelledOrder,
        successfulOrder,
        deliveryInfo,
        orderStatus,
      }}
    >
      {children}
    </CustomHookContext.Provider>
  );
};

export default ContextProvider;
