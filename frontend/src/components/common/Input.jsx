import React from "react";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  name,
  title,
  type,
  placeholder,
  value,
  handleChange,
  disabled = false,
  required = false,
  error = null,
  min=0,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <div className="flex justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {title}
          {required &&  <span className="text-red-500 ms-1">*</span>}
        </label>
      </div>
      <input
        type={isPassword && showPassword ? "text" : type}
        className={`bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 mt-1 w-full ${
          error ? "border border-red-500 focus:ring-red-500" : ""
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
      />
      {isPassword && (
        <div
          className="absolute top-[40px] right-4 cursor-pointer text-gray-400 hover:text-white"
          onClick={togglePassword}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} /> }
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Textarea = ({
  name,
  title,
  placeholder,
  value,
  handleChange,
  disabled = false,
  required = false,
  error = null,
}) => {
  return (
    <div className="mt-3">
      <div className="flex justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {title} {required === true ? <span className="text-red-500">*</span> : ""}
        </label>
      </div>
      <textarea
        type="text"
        className={`bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 mt-1 w-full ${
          error ? "border border-red-500 focus:ring-red-500" : ""
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows="4"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const SearchInput = ({
  placeholder,
  handleChange,
  disabled = false,
  value = "",
}) => {
  return (
    <div className="relative w-full sm:w-72 md:w-96">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onChange={handleChange}
        disabled={disabled}
        value={value}
      />
      <Search className="absolute left-3 top-4 text-gray-400" size={18} />
    </div>
  );
};

export const Select = ({
  name,
  title,
  valueCheck,
  value,
  options = [],
  handleChange,
  disabled = false,
  required = false,
  error = null,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {title} {required === true ? <span className="text-red-500">*</span> : ""}
        </label>
      </div>
      <select
        id={name}
        name={name}
        value={valueCheck ?? ""}
        onChange={handleChange}
        className={`bg-gray-700 rounded-lg pl-4 pr-4 py-2 mt-1 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-gray-600 h-12
                  ${!valueCheck && !value ? "text-gray-400" : "text-white"}
                  ${error ? "border border-red-500 focus:ring-red-500" : ""}
                  ${disabled ? "opacity-70 cursor-not-allowed" : ""}
                  transition-colors duration-200`}
        disabled={disabled}
      >
        <option value="">{`Select ${title}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute right-3 ${!error ? "top-[70%]" : "top-1/2"} transform -translate-y-1/2 pointer-events-none
                ${!valueCheck && !value ? "text-gray-400" : "text-white"}
                transition-colors duration-200`}
        size={18}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
