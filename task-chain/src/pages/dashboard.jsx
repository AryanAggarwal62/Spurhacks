import Profile from "./Profile.jsx";
import Goals from "./Goals.jsx";
import Marketplace from "./Marketplace.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Profile");

  function handleLogout() {
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex bg-base-200">
      <div className="w-48 bg-base-100 p-4 flex flex-col gap-2 shadow-lg bg-neutral-200">
        <button className={`btn btn-ghost justify-start ${tab === 'Profile' ? 'btn-active' : ''}`} onClick={() => setTab('Profile')}>Profile</button>
        <button className={`btn btn-ghost justify-start ${tab === 'Goals' ? 'btn-active' : ''}`} onClick={() => setTab('Goals')}>Goals</button>
        <button className={`btn btn-ghost justify-start ${tab === 'Marketplace' ? 'btn-active' : ''}`} onClick={() => setTab('Marketplace')}>Marketplace</button>
      </div>
      <div className="flex-1 p-8 bg-white">
        {tab === 'Profile' && <Profile onLogout={handleLogout} />}
        {tab === 'Goals' && <Goals />}
        {tab === 'Marketplace' && <Marketplace />}
      </div>
    </div>
  );
}
