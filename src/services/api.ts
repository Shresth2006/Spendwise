import axios from 'axios';
import auth from '@react-native-firebase/auth'; // Added to get real user_id

const BASE_URL = 'http://192.168.1.20:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  // Get only the logged-in user's transactions
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

  // Create a transaction linked to the specific UID
  create: async (txnData: {
    amount: number;
    direction: 'credit' | 'debit';
    category?: string;
    merchant?: string;
    source?: 'manual' | 'sms' | 'csv';
    date?: string;
  }) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user logged in");

      // We append the user_id so the backend saves it in users/{uid}/transactions
      const payload = { ...txnData, user_id: user.uid };
      const response = await api.post('/transactions', payload);
      return response.data;
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  },

  // Process raw text (Zomato SMS) for the current user
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

      // Pass user_id so the CSV rows are assigned to the correct user
      const response = await api.post('/transactions/import-csv', { user_id: user.uid });
      return response.data;
    } catch (error) {
      console.error("CSV Import error:", error);
      throw error;
    }
  }
};

export default api;