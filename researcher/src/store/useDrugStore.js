import { create } from 'zustand';

const useDrugStore = create((set) => ({
  drugs: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedDrug: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedDrug: (drug) => set({ selectedDrug: drug }),

  searchDrugs: async (searchTerm) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(
        `https://api.fda.gov/drug/ndc.json?search=brand_name:${searchTerm}*&limit=10`
      );
      const data = await response.json();
      set({ drugs: data.results || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearSearch: () => set({ drugs: [], searchTerm: '', selectedDrug: null }),
}));

export default useDrugStore;
