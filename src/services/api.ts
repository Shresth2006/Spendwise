import axios from 'axios';
import auth from '@react-native-firebase/auth';

const BASE_URL = 'spendwise-production-cab0.up.railway.app'; // Change to .93 for your friend

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- TRANSACTION SERVICE ---
export const transactionService = {
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
      const response = await api.post('/user/settings/budgets', payload);
      return response.data;
    } catch (error) {
      console.error("Save Budget error:", error);
      throw error;
    }
  },

  getUserBudgets: async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.get(`/user/settings/budgets/${user.uid}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Budget error:", error);
      return { monthly_limit: 0, category_budgets: {} };
    }
  },

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
  }
};

// --- GOAL SERVICE ---
export const goalService = {
  getAll: async () => {
    try {
      const user = auth().currentUser;
      if (!user) return [];
      const response = await api.get(`/goals/${user.uid}`);
      return response.data;
    } catch (error) {
      console.error("Goal Fetch error:", error);
      return [];
    }
  },

  create: async (goalData: any) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const payload = { ...goalData, user_id: user.uid };
      const response = await api.post('/goals', payload);
      return response.data;
    } catch (error) {
      console.error("Goal Create error:", error);
      throw error;
    }
  },

  update: async (goalId: string, updates: any) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      // Fix: Ensure user_id is sent to prevent 500 error on backend
      const payload = { ...updates, user_id: user.uid };
      const response = await api.patch(`/goals/${goalId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Goal Update error:", error);
      throw error;
    }
  },

  delete: async (goalId: string) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.delete(`/goals/${user.uid}/${goalId}`);
      return response.data;
    } catch (error) {
      console.error("Goal Delete error:", error);
      throw error;
    }
  }
};

// --- REMINDER SERVICE ---
export const reminderService = {
  getAll: async () => {
    try {
      const user = auth().currentUser;
      if (!user) return [];
      const response = await api.get(`/reminders/${user.uid}`);
      return response.data;
    } catch (error) {
      console.error("Reminder Fetch error:", error);
      return [];
    }
  },

  save: async (reminderData: any) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const payload = { ...reminderData, user_id: user.uid };
      const response = await api.post('/reminders', payload);
      return response.data;
    } catch (error) {
      console.error("Reminder Save error:", error);
      throw error;
    }
  },

  delete: async (remId: string) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");
      const response = await api.delete(`/reminders/${user.uid}/${remId}`);
      return response.data;
    } catch (error) {
      console.error("Reminder Delete error:", error);
      throw error;
    }
  }
};

export default api;