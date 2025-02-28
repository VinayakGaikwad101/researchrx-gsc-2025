import fetch from "node-fetch";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

export const periodicTable = async (req, res) => {
  const cachedData = cache.get("periodicTableData");
  if (cachedData) {
    return res.json({ success: true, message: cachedData });
  }

  try {
    const response = await fetch(
      "https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    cache.set("periodicTableData", data);
    res.json({ success: true, message: data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.json({ success: false, message: "Error fetching data" });
  }
};
