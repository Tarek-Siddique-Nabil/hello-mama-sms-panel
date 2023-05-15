// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { CustomHookContext } from "../../Context Api/useHooks";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {
  const { deliveryInfo } = useContext(CustomHookContext);
  const [sortedData, setSortedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const groupDataByDate = () => {
      const sortedDeliveryInfo = [...deliveryInfo].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      const groupedData = [];
      sortedDeliveryInfo.forEach((item) => {
        const date = new Date(item.time).toLocaleDateString();
        const lastGroup = groupedData[groupedData.length - 1];

        if (!lastGroup || lastGroup[0] !== date) {
          groupedData.push([date, [item]]);
        } else {
          lastGroup[1].push(item);
        }
      });

      setSortedData(groupedData);
    };

    groupDataByDate();
  }, [deliveryInfo]);

  return (
    <div>
      {sortedData?.map(([date, items]) => (
        <div
          className={
            isModalOpen === true
              ? "blur-sm transition-all duration-100 ease-out "
              : ""
          }
          key={date}
        >
          <h3 className="w-28 text-center my-6 bg-sky-300 rounded-xl shadow-lg shadow-emerald-300">
            {date}
          </h3>
          <section className="flex flex-wrap gap-2 justify-center">
            {items?.map((item) => (
              <div key={item._id}>
                <div className=" w-60 h-10 flex  justify-center items-center gap-2 border border-black  rounded-xl ">
                  <p>
                    <span className="font-semibold"> Number</span>:-
                    <span>{item.info[0].number}</span>
                  </p>
                  <button
                    onClick={() => {
                      setSelectedItem(item), setIsModalOpen(!isModalOpen);
                    }}
                    className="bg-violet-500 px-1.5 py-1 rounded-lg"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      ))}

      <AnimatePresence>
        {selectedItem && isModalOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              isModalOpen === true &&
              "fixed  inset-0 z-50 bg-transparent    flex items-center justify-center"
            }
          >
            <motion.div
              className="w-[290px] bg-gray-400 rounded-xl px-3 py-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
              }}
            >
              <motion.div>
                <p>
                  <span className="font-semibold">Name</span>:-
                  <span>{selectedItem.info[0].fullName}</span>
                </p>
                <p>
                  <span className="font-semibold"> Email</span>:-
                  <span>{selectedItem.info[0].email}</span>
                </p>
                <p>
                  <span className="font-semibold"> Number</span>:-
                  <span>{selectedItem.info[0].number}</span>
                </p>
                <p>
                  <span className="font-semibold"> Payment Number</span>:-
                  <span>{selectedItem.payment_number}</span>
                </p>
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="bg-red-300 rounded-xl px-1.5 py-1"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
