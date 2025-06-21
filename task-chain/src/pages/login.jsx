import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../services/api.js";

export default function Login({ onLogin }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userData = await connectWallet(walletAddress);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update parent component state
      onLogin(userData);
      
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to connect wallet. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-pink-200 ">
      <div className="card max-w-sm w-auto bg-white shadow-2xl text-black">
        <form className="card-body" onSubmit={handleLogin}>
          <h2 className="card-title text-3xl font-bold mb-4 justify-center text-primary">GoalForge</h2>
          <p className="text-center text-gray-600 mb-6">Connect your wallet to start your journey</p>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Wallet Address</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-primary bg-base-100 text-black"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <button 
            className={`btn btn-primary w-full text-white ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>For demo purposes, you can use any wallet address</p>
            <p>e.g., 0x1234567890abcdef</p>
          </div>
        </form>
      </div>
    </div>
  );
}
