import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const getGoalCollection = () => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');
  return firestore().collection('users').doc(userId).collection('goals');
};

export const goalService = {
  // Listen to goals in real-time
  subscribeToGoals: (onUpdate: (goals: any[]) => void) => {
    return getGoalCollection().onSnapshot(snapshot => {
      const goalsList = snapshot.docs.map(doc => ({
        id: doc.id, // Firestore string ID
        ...doc.data(),
      }));
      onUpdate(goalsList);
    });
  },

  addGoal: async (goal: { name: string; target: number; deadline: string }) => {
    await getGoalCollection().add({
      ...goal,
      current: 0,
      suggestedDaily: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  updateGoal: async (id: string, updates: any) => {
    await getGoalCollection().doc(id).update(updates);
  },

  deleteGoal: async (id: string) => {
    await getGoalCollection().doc(id).delete();
  },
};