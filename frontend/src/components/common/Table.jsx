import { motion } from "framer-motion";
import { FolderOpen, Loader2 } from "lucide-react";
import React, { useState } from "react";
import Loading from "./Loading";

export const Table = ({
  headings = [],
  data = [],
  renderRow,
  isLoading = false,
  isSerialNo = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate rows for loading state
  const renderRows = () => {
    return Array()
      .fill(0)
      .map((_, index) => (
        <tr key={index} className="animate-pulse">
          {Array(headings.length)
            .fill(0)
            .map((_, cellIndex) => (
              <td
                key={`${index}-${cellIndex}`}
                className="px-6 py-4 whitespace-nowrap"
              >
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </td>
            ))}
        </tr>
      ));
  };

  return (
    <div className="overflow-x-auto relative">
      {isLoading && data.length > 0 && <Loading />}

      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider sticky top-0 z-10 bg-gray-800"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        {isLoading && data.length === 0 ? (
          <tbody className="divide-y divide-gray-700">{renderRows()}</tbody>
        ) : data.length > 0 ? (
          <tbody className="divide-y divide-gray-700">
            {currentData.map((item, index) =>
              renderRow ? (
                <motion.tr
                  key={item._id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                > 
                  {isSerialNo && 
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                    {indexOfFirstData + index + 1}
                  </td>
                  }
                  {renderRow(item, index)}
                </motion.tr>
              ) : null
            )}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={headings.length}
                className="text-center text-gray-400 py-12 font-medium"
              >
                <div className="flex flex-col items-center">
                  <FolderOpen size={50} />
                  <span>No Records Found</span>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-300">
          {indexOfFirstData + 1} to {Math.min(indexOfLastData, data.length)} of{" "}
          {data.length}
        </div>
        <div className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(data.length / dataPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
