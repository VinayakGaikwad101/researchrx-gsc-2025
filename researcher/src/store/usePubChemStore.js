import { create } from "zustand";

const usePubChemStore = create((set) => ({
  elements: [],
  loading: false,
  error: null,
  getCompoundIdByName: async (symbol) => {
    // Transform symbol if necessary (e.g., H2O)
    const elementName = encodeURIComponent(symbol);
    console.log(`Fetching CID for ${symbol}`);
    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${elementName}/cids/JSON`
    );
    if (!response.ok) {
      console.error(`Failed to fetch CID for ${symbol}:`, response.statusText);
      throw new Error(`Failed to fetch CID for ${symbol}`);
    }
    const data = await response.json();
    console.log(`Fetched CID for ${symbol}:`, data);
    return data.IdentifierList.CID[0];
  },
  fetchElements: async () => {
    set({ loading: true });
    console.log("Fetching elements...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/researcher/periodic-table`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        console.error(
          "Failed to fetch periodic table data:",
          response.statusText
        );
        throw new Error("Failed to fetch periodic table data");
      }
      const data = await response.json();
      console.log("Fetched elements:", data);
      if (data.success) {
        console.log("Setting elements...");
        set({
          elements: data.message.Table.Row,
          loading: false,
        });
        console.log("Elements set successfully.");
      } else {
        console.error("Failed to fetch data:", data.message);
        set({ error: "Failed to fetch data", loading: false });
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default usePubChemStore;
