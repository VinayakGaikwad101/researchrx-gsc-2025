import fetch from "node-fetch";

export const periodicTable = async (req, res) => {
  try {
    const response = await fetch(
      "https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.json({ success: true, message: data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.json({ success: false, message: "Error fetching data" });
  }
};
