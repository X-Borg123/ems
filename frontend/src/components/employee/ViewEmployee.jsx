import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { employeeStore } from "../../stores/employee.store";
import Loading from "../common/Loading";
import Navbar from "../layout/Navbar";
import moment from "moment";
import { toJS } from "mobx";

const ViewEmployee = observer(() => {
  const { id } = useParams();
  const { employee, fetchEmployee, phones } = employeeStore;
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEmployee(id);
  }, [id]);

  return (
    <>
      {employee ? (
        <div className="flex-1 overflow-auto relative z-10">
          <Navbar title="Employee Details" />

          <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square w-40 sm:w-56 md:w-72 rounded-full overflow-hidden border justify-self-center">
                  <img
                    src={`${baseURL}/${employee.userId.profileImage}`}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Employee Details */}
                <div className="text-gray-300 space-y-5">
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Name</span>
                    <span className="text-gray-200">
                      {employee.userId.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Date of Birth</span>
                    <span className="text-gray-200">
                      {moment(employee.dob).format("DD/MM/yyyy")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">
                      National Register of Citizens
                    </span>
                    {employee.userId.nrc.replace(
                      /([A-Za-z()]+)(\d+)$/,
                      "$1 $2"
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Gender</span>
                    <span className="text-gray-200">{employee.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Marital Status</span>
                    <span className="text-gray-200">
                      {employee.maritalStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Current Address</span>
                    <span className="text-gray-200">
                      {employee.userId.current_address}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Permanent Address</span>
                    <span className="text-gray-200">
                      {employee.userId.permanent_address}
                    </span>
                  </div>
                  {/* Phones Section (from MobX store) */}
                  {phones.length > 0 && (
                    <div className="mb-4">
                      <div className="space-y-6">
                        {phones.map((phone, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-12">
                            <span className="text-gray-200">{phone.type}</span>
                            <span className="text-gray-200">
                              {phone.number}{" "}
                              {phone.note && (
                                <span className="text-gray-400">
                                  ({phone.note})
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side - Work Information */}
                <div className="md:border-r md:border-gray-700 md:pr-4 space-y-5">
                  <h1 className="text-2xl text-gray-100 mb-4 font-semibold">
                    Work Information
                  </h1>

                  <div className="grid grid-cols-2 gap-12 md:mt-8">
                    <span className="text-gray-200">Employee ID</span>
                    <span className="text-gray-200">{employee.employeeId}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Employee Type</span>
                    <span className="text-gray-200">
                      {employee.employeeType}
                    </span>
                  </div>

                  {employee?.duration != 0 && (
                    <div className="grid grid-cols-2 gap-12">
                      <span className="text-gray-200">Duration</span>
                      <span className="text-gray-200">
                        {employee.duration} months
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Work Start Day</span>
                    <span className="text-gray-200">
                      {moment(employee.workStartDay).format("DD/MM/yyyy")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Department</span>
                    <span className="text-gray-200">
                      {employee.department.dep_name}
                    </span>
                  </div>
                </div>

                {/* Right Side - Leave Balance */}
                <div className="md:pl-4 space-y-5">
                  <h1 className="text-2xl text-gray-100 mb-4 font-semibold">
                    Leave Balance
                  </h1>

                  <div className="grid grid-cols-2 gap-12 md:mt-8">
                    <span className="text-gray-200">Annual Leave</span>
                    <span className="text-gray-200">
                      {employee.annualLeave}{" "}
                      {employee.annualLeave > 0 ? "days" : "day"} remaining
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Casual Leave</span>
                    <span className="text-gray-200">
                      {employee.casualLeave}{" "}
                      {employee.casualLeave > 0 ? "days" : "day"} remaining
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">Medical Leave</span>
                    <span className="text-gray-200">
                      {employee.medicalLeave}{" "}
                      {employee.medicalLeave > 0 ? "days" : "day"} remaining
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <span className="text-gray-200">
                      Maternity, and Paternity Leave
                    </span>
                    <span className="text-gray-200">
                      {employee.maternityLeave}{" "}
                      {employee.maternityLeave > 0 ? "days" : "day"} remaining
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </>
  );
});

export default ViewEmployee;
