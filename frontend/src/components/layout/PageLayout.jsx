// components/AdminPageLayout.jsx
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { observer } from "mobx-react-lite";
import React from "react";

const PageLayout = observer(({ title, children, maxWidth = "max-w-8xl" }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title={title} />
      <main className={`${maxWidth} mx-auto py-6 px-4 lg:px-8`}>
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
});

export default PageLayout;
