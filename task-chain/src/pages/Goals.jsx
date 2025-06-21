import { useState, useEffect } from "react";
import { createGoal, getUserGoals, completeGoal } from "../services/api.js";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
      loadGoals();
    }
  }, [user._id]);

  const loadGoals = async () => {
    try {
      const goalsData = await getUserGoals(user._id);
      setGoals(goalsData);
    } catch (error) {
      setError("Failed to load goals");
      console.error("Error loading goals:", error);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalDescription.trim()) {
      setError("Please fill in both title and description");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await createGoal(user._id, newGoalTitle, newGoalDescription);
      setNewGoalTitle("");
      setNewGoalDescription("");
      setSuccess("Goal created successfully!");
      loadGoals(); // Reload goals
    } catch (error) {
      setError("Failed to create goal");
      console.error("Error creating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteGoal = async (goalId) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await completeGoal(goalId);
      setSuccess("Goal completed! You earned an NFT!");
      loadGoals(); // Reload goals
    } catch (error) {
      setError("Failed to complete goal");
      console.error("Error completing goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user._id) {
    return (
      <div className="text-center">
        <p>Please connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Goals</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <span>{success}</span>
        </div>
      )}

      <form className="card bg-base-100 shadow-md p-6 mb-6" onSubmit={handleAddGoal}>
        <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Goal Title</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="e.g., Run a 5K"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Describe your goal..."
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            disabled={isLoading}
            rows="3"
          />
        </div>
        <button 
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Creating...' : 'Create Goal'}
        </button>
      </form>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {goals.map(goal => (
          <div key={goal._id} className={`card bg-base-100 shadow-md p-4 ${goal.status === 'completed' ? 'opacity-75' : ''}`}>
            <div className="card-body p-0">
              <h3 className="card-title text-lg">{goal.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
              
              <div className="flex justify-between items-center">
                <span className={`badge ${goal.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                  {goal.status}
                </span>
                
                {goal.status === 'active' && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleCompleteGoal(goal._id)}
                    disabled={isLoading}
                  >
                    Complete
                  </button>
                )}
              </div>
              
              {goal.completed_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Completed: {new Date(goal.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No goals yet. Create your first goal to get started!</p>
        </div>
      )}
    </div>
  );
}
