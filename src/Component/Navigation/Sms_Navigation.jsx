// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import Sms from "../Pages/Sms";
import History from "../Pages/History";
import { AuthContext } from "../../Context Api/AuthContext";

const Sms_Navigation = () => {
  const { user, logOut } = useContext(AuthContext);
  const tabs = [
    {
      icon: "✉",
      label: "Sms",
      scene: <Sms />,
    },
    {
      icon: "📝",
      label: "History",
      scene: <History />,
    },
  ];
  const [selectedTab, setSelectedTab] = useState({
    icon: "📃",
    label: "Product",
    scene: <Sms />,
  });
  return (
    <>
      <div className="container lg:px-16 py-5 mx-auto border">
        <div className="container flex justify-end">
          <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="btn btn-error m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <p>{user?.email}</p>
              </li>
              <li>
                <button
                  className="bg-red-500 rounded-xl"
                  onClick={() => {
                    logOut(),
                      localStorage.removeItem("User role"),
                      localStorage.removeItem("User email");
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-lg font-semibold text-center mb-3">Delivery Pages</p>
        <nav>
          <div className="flex justify-center gap-5">
            {tabs.map((item, index) => (
              <button
                className={
                  item.label === selectedTab.label
                    ? "border-2 px-3 py-1 rounded-xl bg-green-300 transition-all duration-300 ease-out"
                    : "border-2 px-3 py-1 rounded-xl transition-all duration-300 ease-out"
                }
                key={index}
                onClick={() => setSelectedTab(item)}
              >
                {item.icon}
                <span
                  className={
                    index === selectedTab
                      ? "underline-animation"
                      : "no-underline"
                  }
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <hr className="bg-gray-700 rounded w-1/2 h-1 mt-3 mx-auto" />
        </nav>
        <main>
          <AnimatePresence>
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            ></motion.div>
            {selectedTab?.scene}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default Sms_Navigation;
