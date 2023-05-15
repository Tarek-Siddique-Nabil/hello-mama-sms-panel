// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import axios from "axios";
import { CustomHookContext } from "../../Context Api/useHooks";
import { AuthContext } from "../../Context Api/AuthContext";

const Sms = () => {
  const { shipmentOrder, orderStatus } = useContext(CustomHookContext);
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState(null);
  const [value, setValue] = useState(0);
  const [randomNumber, setRandomNumber] = useState(null);
  console.log("🚀 ~ file: Sms.jsx:15 ~ Sms ~ randomNumber:", randomNumber);
  const [code, setcode] = useState(null);
  console.log("🚀 ~ file: Sms.jsx:16 ~ Sms ~ code:", code);
  useEffect(() => {
    if (value <= 0) {
      // Timer has expired, do something here
      return;
    }
    const intervalId = setInterval(() => {
      setValue((prevTimeRemaining) => prevTimeRemaining - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [value]);

  const data = [];

  for (const order of shipmentOrder) {
    if (
      order?.info[0]?.number?.toLowerCase().indexOf(input?.toLowerCase()) !=
        -1 ||
      order?.info[0]?.fullName.toLowerCase().indexOf(input?.toLowerCase()) != -1
    ) {
      data.push(order);
    }
  }
  const sendSms = (number) => {
    const randomNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");

    setRandomNumber(randomNum);
    const postSMS = async () => {
      try {
        const url = `http://sms.mayabd.org/smsapi?api_key=${
          import.meta.env.VITE_APP_SECRET_SMS_API_KEY
        }&type=text&contacts=${number?.number}&senderid=${
          import.meta.env.VITE_APP_SECRET_SMS_API_SENDER_ID
        }&msg=${randomNum} `;
        const response = await axios.post(url);
        const json = response.data;

        if (json) {
          toast.success("Message Send", {
            position: "top-center",
            duration: 1000,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    postSMS(); // Call the postSMS function to send the SMS
    setValue(60);
  };
  const verify = async (id) => {
    if (randomNumber === code) {
      await orderStatus(id, {
        status: "successful",
        deliveryBoy: `${user?.email}`,
      });
      setInput(null);
      setRandomNumber(null);
      setcode(null);
      setValue(0);
    } else {
      toast.error("CODE ERROR", {
        position: "top-center",
        duration: 1500,
      });
    }
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <p className="text-xl font-semibold">Delivery </p>
        <div>
          <input
            onChange={(e) => setInput(e.target.value)}
            className="w-60 h-10 p-2 rounded-lg border border-cyan-200 "
            placeholder="Search by number or name "
          />
        </div>
        <section className="px-2">
          {data &&
            data.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between items-center border-2 border-gray-600 my-2 p-2 rounded-xl "
              >
                <div>
                  <div>
                    <p className="text-lg font-semibold">Shipping Address:-</p>
                    <p>
                      {item?.info[0]?.division} ,{item?.info[0]?.district},
                      {item?.info[0]?.upazila}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">Details</p>
                    <div>
                      <div>
                        <p>
                          <span className="font-medium text-lg">Name:-</span>
                          <span>{item?.info[0]?.fullName}</span>
                        </p>
                        <p>
                          <span className="font-medium text-lg">Number:-</span>
                          <span>{item?.info[0]?.number}</span>
                        </p>
                        <p>
                          <span className="font-medium text-lg">Email:-</span>
                          <span>{item?.info[0]?.createdByEmail}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">Order Info</p>
                  <div>
                    <p>
                      <span className="font-semibold">Total:-</span>
                      <span>{item?.amount}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Transiction Id :-</span>
                      <span>{item?.transaction_id}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Payment Number :-</span>
                      <span>{item?.payment_number}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Status :-</span>
                      <span>{item?.status}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Order Date :-</span>
                      <span>{item?.time}</span>
                    </p>
                  </div>
                </div>
                <div className="w-full flex gap-5 ">
                  <input
                    onChange={(e) => setcode(e.target.value)}
                    className="w-1/2 border-blue-400 border rounded-lg px-2
                  "
                    placeholder="CODE"
                  />
                  <div className="w-1/2 flex gap-3">
                    {value > 0 ? (
                      <button
                        disabled
                        onClick={() => toast.loading(`wait ${value} sec`)}
                        className="bg-sky-400 p-2 rounded-xl  disabled:brightness-75"
                      >
                        {value} Send Code
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          sendSms({ number: item?.info[0]?.number })
                        }
                        className="bg-sky-400 p-2 rounded-xl"
                      >
                        Send Code
                      </button>
                    )}
                    {code?.length > 3 && (
                      <button
                        onClick={() => verify(item._id)}
                        className="bg-teal-300 p-2 rounded-xl"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default Sms;
