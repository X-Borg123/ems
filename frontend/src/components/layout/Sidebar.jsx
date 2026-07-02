import { Menu } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { observer } from "mobx-react-lite";
import { employeeStore } from "../../stores/employee.store";

const Sidebar = observer(({SIDEBAR_ITEMS}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { handleShowUniqueEmployee } = employeeStore;

  return (
    <motion.div
      className={`relative z-10 transition-all duration-10 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            <Menu size={24} />
          </motion.button>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="text-lg font-semibold text-gray-100 whitespace-nowrap"
            >
              Welcome, {user.name.split(" ")[0]}
            </motion.span>
          )}
        </div>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
                  isActive ? "bg-gray-700 text-white" : "text-gray-300"
                }`
              }
              end
              onClick={() => handleShowUniqueEmployee(false)}
            >
              <item.icon
                size={20}
                style={{ color: item.color, minWidth: "20px" }}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.1, delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.div>
  );
});

export default Sidebar;
