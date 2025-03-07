import { create } from 'zustand';

const useDrugStore = create((set, get) => ({
  contributedDrugs: [],
  publicDrugs: [],
  loading: false,
  error: null,
  selectedDrug: null,
  searchTerm: '',
  activeTab: 'contributed',

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedDrug: (drug) => set({ selectedDrug: drug }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Search drugs (both contributed and public)
  searchDrugs: async (searchTerm) => {
    try {
      set({ loading: true, error: null });
      const activeTab = get().activeTab;
      
      if (activeTab === 'public') {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs/public/search?name=${encodeURIComponent(searchTerm)}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to search public drugs');
        const data = await response.json();
        set({ publicDrugs: data.compounds, loading: false });
      } else {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs/search?name=${encodeURIComponent(searchTerm)}&source=contributed`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to search drugs');
        const data = await response.json();
        set({ contributedDrugs: data, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a new drug contribution
  addDrugContribution: async (smiles, name, isPublic = false) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ smiles, name, isPublic })
      });
      if (!response.ok) throw new Error('Failed to add drug');
      const drug = await response.json();
      set(state => ({
        contributedDrugs: [...state.contributedDrugs, drug],
        loading: false
      }));
      return drug;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get all contributed drugs
  getContributedDrugs: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs?source=contributed`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch drugs');
      const data = await response.json();
      set({ contributedDrugs: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a note to a drug
  addNote: async (drugId, note) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs/${drugId}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ note })
      });
      if (!response.ok) throw new Error('Failed to add note');
      const updatedDrug = await response.json();
      
      set(state => ({
        contributedDrugs: state.contributedDrugs.map(drug => 
          drug._id === drugId ? updatedDrug : drug
        ),
        loading: false
      }));
      return updatedDrug;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Toggle drug visibility
  toggleVisibility: async (drugId) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/drugs/${drugId}/visibility`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to toggle visibility');
      const updatedDrug = await response.json();
      
      set(state => ({
        contributedDrugs: state.contributedDrugs.map(drug => 
          drug._id === drugId ? updatedDrug : drug
        ),
        loading: false
      }));
      return updatedDrug;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearSearch: () => set({ 
    contributedDrugs: [], 
    publicDrugs: [], 
    searchTerm: '', 
    selectedDrug: null 
  }),
}));

export default useDrugStore;
