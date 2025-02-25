import { create } from "zustand";
import toast from "react-hot-toast";

// List of accepted symptoms
const acceptedSymptoms = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "continuous_sneezing",
  "shivering",
  "chills",
  "joint_pain",
  "stomach_pain",
  "acidity",
  "ulcers_on_tongue",
  "muscle_wasting",
  "vomiting",
  "burning_micturition",
  "spotting_urination",
  "fatigue",
  "weight_gain",
  "anxiety",
  "cold_hands_and_feets",
  "mood_swings",
  "weight_loss",
  "restlessness",
  "lethargy",
  "patches_in_throat",
  "irregular_sugar_level",
  "cough",
  "high_fever",
  "sunken_eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish_skin",
  "dark_urine",
  "nausea",
  "loss_of_appetite",
  "pain_behind_the_eyes",
  "back_pain",
  "constipation",
  "abdominal_pain",
  "diarrhoea",
  "mild_fever",
  "yellow_urine",
  "yellowing_of_eyes",
  "acute_liver_failure",
  "fluid_overload",
  "swelling_of_stomach",
  "swelled_lymph_nodes",
  "malaise",
  "blurred_and_distorted_vision",
  "phlegm",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "chest_pain",
  "weakness_in_limbs",
  "fast_heart_rate",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "neck_pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen_legs",
  "swollen_blood_vessels",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "excessive_hunger",
  "extra_marital_contacts",
  "drying_and_tingling_lips",
  "slurred_speech",
  "knee_pain",
  "hip_joint_pain",
  "muscle_weakness",
  "stiff_neck",
  "swelling_joints",
  "movement_stiffness",
  "spinning_movements",
  "loss_of_balance",
  "unsteadiness",
  "weakness_of_one_body_side",
  "loss_of_smell",
  "bladder_discomfort",
  "foul_smell_of_urine",
  "continuous_feel_of_urine",
  "passage_of_gases",
  "internal_itching",
  "toxic_look_(typhos)",
  "depression",
  "irritability",
  "muscle_pain",
  "altered_sensorium",
  "red_spots_over_body",
  "belly_pain",
  "abnormal_menstruation",
  "dischromic_patches",
  "watering_from_eyes",
  "increased_appetite",
  "polyuria",
  "family_history",
  "mucoid_sputum",
  "rusty_sputum",
  "lack_of_concentration",
  "visual_disturbances",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "coma",
  "stomach_bleeding",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "fluid_overload.1",
  "blood_in_sputum",
  "prominent_veins_on_calf",
  "palpitations",
  "painful_walking",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
];

// Function to find the closest match using string similarity
const findClosestMatch = (inputSymptom) => {
  let closestMatch = null;
  let highestSimilarity = 0;

  acceptedSymptoms.forEach((symptom) => {
    const similarity = getSimilarity(inputSymptom, symptom);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      closestMatch = symptom;
    }
  });

  return closestMatch;
};

// Function to calculate the similarity between two strings
const getSimilarity = (str1, str2) => {
  let longer = str1;
  let shorter = str2;
  if (str1.length < str2.length) {
    longer = str2;
    shorter = str1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
};

// Function to calculate the edit distance between two strings
const editDistance = (str1, str2) => {
  const costs = [];
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[str2.length] = lastValue;
  }
  return costs[str2.length];
};

export const useSelfDiagnosis = create((set) => ({
  symptoms: [],
  disease: null,
  isLoading: false,
  error: null,
  selfDiagnose: async (symptomsArray) => {
    set({ isLoading: true, error: null });

    // Find closest matches for all entered symptoms
    const recognizedSymptoms = symptomsArray.map((symptom) =>
      findClosestMatch(symptom)
    );

    if (recognizedSymptoms.length === 0) {
      toast.error(
        "None of the entered symptoms are recognized. Please check your input."
      );
      set({ isLoading: false });
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_SELF_DIAGNOSIS_ENDPOINT,
        {
          method: "POST",
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_x_rapidapi_key,
            "x-rapidapi-host": import.meta.env
              .VITE_x_rapidapi_host_SELF_DIAGNOSIS,
            "Content-Type": "application/json",
            "x-token": "Makshad Nai Bhoolna @ 2025",
          },
          body: JSON.stringify({ symptoms: recognizedSymptoms.join(", ") }),
        }
      );

      if (response.status === 422) {
        toast.error("Symptom not recognized. Please check your input.");
        set({ isLoading: false });
        return;
      }

      if (response.status !== 200) {
        toast.error("Error in self diagnostics");
        set({ isLoading: false });
        return;
      }

      const data = await response.json();
      set({ disease: data.disease, isLoading: false });
    } catch (error) {
      toast.error("Error in self diagnostics");
      set({ isLoading: false, error: error.message });
    }
  },
}));
