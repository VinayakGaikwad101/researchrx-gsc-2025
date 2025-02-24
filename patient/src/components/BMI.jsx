import React, { useState } from "react";
import { useBMIStore } from "../store/useBMIStore";
import toast from "react-hot-toast";

const BMI = () => {
  const { BMI, isLoading, fetchBMI } = useBMIStore();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");

  const handleFetchBMI = async () => {
    if (!height || !weight) {
      toast.error("Height and Weight required");
    } else if (!unit) {
      toast.error("Unit required");
    } else {
      const convertedHeight = unit === "imperial" ? height * 2.54 : height; // Convert inches to cm
      const convertedWeight = unit === "imperial" ? weight * 0.453592 : weight; // Convert lbs to kg
      await fetchBMI({
        height: convertedHeight,
        weight: convertedWeight,
        unit,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mb-4">BMI Calculator</h1>
      <div className="mb-4">
        <label className="block mb-2">
          {unit === "metric" ? "Height (cm)" : "Height (inches)"}
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </label>
      </div>
      <div className="mb-4">
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="">Select Unit</option>
          <option value="metric">Metric (cm, kg)</option>
          <option value="imperial">Imperial (inches, lbs)</option>
        </select>
      </div>
      <button
        onClick={handleFetchBMI}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Calculate BMI
      </button>
      {isLoading ? (
        <p className="mt-4 text-gray-500">Loading...</p>
      ) : (
        <p className="mt-4">BMI: {BMI}</p>
      )}
    </div>
  );
};

export default BMI;
