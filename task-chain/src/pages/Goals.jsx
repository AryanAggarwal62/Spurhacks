import { useState } from "react";

export default function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Learn React" },
    { id: 2, title: "Build a project" },
  ]);
  const [newGoal, setNewGoal] = useState("");

  function addGoal(e) {
    e.preventDefault();
    if (newGoal.trim() === "") return;
    setGoals([
      ...goals,
      { id: Date.now(), title: newGoal }
    ]);
    setNewGoal("");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Goals</h2>
      <form className="flex gap-2 mb-6" onSubmit={addGoal}>
        <input
          className="input input-bordered flex-1"
          type="text"
          placeholder="Add a new goal"
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {goals.map(goal => (
          <div key={goal.id} className="card bg-base-100 shadow-md p-4">
            <div className="card-body p-0">
              <h3 className="card-title text-lg">{goal.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
