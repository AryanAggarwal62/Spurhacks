import { useState } from "react";
import { useNavigate } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
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

  async function handleMetaMaskConnect() {
    setIsLoading(true);
    setError("");
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        setError("MetaMask not detected. Please install MetaMask.");
        setIsLoading(false);
        return;
      }
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      // Proceed with backend login
      const userData = await connectWallet(address);
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to connect MetaMask. Please try again.");
      console.error("MetaMask login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-pink-200 ">
      <div className="card max-w-sm w-auto bg-white shadow-2xl text-black">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-4 justify-center text-primary">GoalForge</h2>
          <p className="text-center text-gray-600 mb-6">Connect your wallet to start your journey</p>
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          <button
            type="button"
            className={`btn btn-primary w-full text-white mb-4 ${isLoading ? 'loading' : ''}`}
            onClick={handleMetaMaskConnect}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect with MetaMask'}
          </button>
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>Requires MetaMask browser extension</p>
          </div>
        </div>
      </div>
    </div>
  );
}
