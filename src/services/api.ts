import axios from 'axios';
import auth from '@react-native-firebase/auth';

const BASE_URL = 'http://192.168.1.94:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  // --- EXISTING METHODS ---
  getAll: async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.get(`/transactions/${user.uid}`); 
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  },

  create: async (txnData: any) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const payload = { ...txnData, user_id: user.uid };
      const response = await api.post('/transactions', payload);
      return response.data;
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  },

  // --- NEW BUDGET METHODS (Fixed the error) ---

  /**
   * Saves the personalized budgets set in BudgetSetup.tsx to the backend
   */
  saveUserBudgets: async (budgetData: { 
    monthlyLimit: number; 
    categoryBudgets: Record<string, number> 
  }) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");

      const payload = {
        user_id: user.uid,
        monthly_limit: budgetData.monthlyLimit,
        category_budgets: budgetData.categoryBudgets,
      };

      // This hits your backend to save the data in your DB (Postgres/Mongo/etc)
      const response = await api.post('/user/settings/budgets', payload);
      return response.data;
    } catch (error) {
      console.error("Save Budget error:", error);
      throw error;
    }
  },

  /**
   * Fetches the saved budgets to display real progress bars on Dashboard
   */
  getUserBudgets: async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");

      const response = await api.get(`/user/settings/budgets/${user.uid}`);
      return response.data; // Expected: { monthly_limit: X, category_budgets: {...} }
    } catch (error) {
      console.error("Fetch Budget error:", error);
      return { monthly_limit: 0, category_budgets: {} };
    }
  },

  // --- RAW TEXT & CSV ---
  processRawText: async (rawText: string, address: string = "SMS") => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.post('/transactions/process-sms', { 
        user_id: user.uid,
        body: rawText,
        originatingAddress: address
      });
      return response.data;
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  },

  importCsv: async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.post('/transactions/import-csv', { user_id: user.uid });
      return response.data;
    } catch (error) {
      console.error("CSV Import error:", error);
      throw error;
    }
  }
};

// Add this to the bottom of your api.ts (before the export default api)

export const goalService = {
  getAll: async () => {
    try {
      const user = auth().currentUser;
      if (!user) return [];
      const response = await api.get(`/goals/${user.uid}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

export default api;