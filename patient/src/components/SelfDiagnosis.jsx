import React, { useState } from "react";
import { useSelfDiagnosis } from "../store/useSelfDiagnosis";

const SelfDiagnosis = () => {
  const [userInput, setUserInput] = useState("");
  const { selfDiagnose, isLoading, error, disease } = useSelfDiagnosis();

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const symptomsArray = userInput
      .split(/[\n, ]+/)
      .map((symptom) => symptom.trim().toLowerCase().replace(/\s+/g, "_"));
    selfDiagnose(symptomsArray);
  };

  return (
    <div>
      <h1>Self Diagnosis</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter symptoms separated by new lines, commas, or spaces"
          rows="10"
          cols="50"
        />
        <button type="submit" disabled={isLoading}>
          Diagnose
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {disease && <p>Diagnosis: {disease}</p>}
    </div>
  );
};

export default SelfDiagnosis;
