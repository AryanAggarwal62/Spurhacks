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
      <h2 className="text-6xl font-bold text-black">Goals</h2>

      {error && (
        <div className="alert alert-error mb-4 bg-red-100 border border-red-300 text-black">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4 bg-green-100 border border-green-300 text-green-900">
          <span>{success}</span>
        </div>
      )}

      <form className="card bg-base-100 shadow-md p-6 mb-6" onSubmit={handleAddGoal}>
        <h3 className="text-2xl font-semibold mb-4 text-neutral-800">Create New Goal</h3>
        <div className="form-control mb-4 text-neutral-800 ">
          <label className="label">
            <span className="label-text">Goal Title</span>
          </label>
          <input
            className="input input-bordered mx-4 bg-neutral-100 text-neutral-900 placeholder:text-neutral-400"
            type="text"
            placeholder="e.g., Run a 5K"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-control mb-4 text-neutral-800">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered mx-4 bg-neutral-100 text-neutral-900 placeholder:text-neutral-400"
            placeholder="Describe your goal..."
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            disabled={isLoading}
            rows="3"
          />
        </div>
        <button 
          className={`btn bg-primary text-white ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Creating...' : 'Create Goal'}
        </button>
      </form>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-neutral-900">
        {goals.map(goal => (
          <div key={goal._id} className={`card bg-white border border-neutral-200 shadow rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-transform hover:scale-[1.01] ${goal.status === 'completed' ? 'opacity-70' : ''}`}>
            <div>
              <h3 className="card-title text-lg font-bold text-primary mb-2 flex items-center gap-2">
                {goal.title}
                {goal.status === 'completed' && <span className="badge badge-success text-xs ml-2">Completed</span>}
              </h3>
              <p className="text-neutral-500 text-base mb-4">{goal.description}</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className={`badge px-3 py-1 text-xs font-semibold ${goal.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>{goal.status}</span>
              {goal.status === 'active' && (
                <button 
                  className="btn btn-primary btn-sm text-white shadow-md hover:bg-primary-focus"
                  onClick={() => handleCompleteGoal(goal._id)}
                  disabled={isLoading}
                >
                  Complete
                </button>
              )}
            </div>
            {goal.completed_at && (
              <p className="text-xs text-neutral-400 mt-3 text-right">
                Completed: {new Date(goal.completed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      {goals.length === 0 && (
        <div className="text-center text-neutral-400 mt-8">
          <p>No goals yet. Create your first goal to get started!</p>
        </div>
      )}
    </div>
  );
}
