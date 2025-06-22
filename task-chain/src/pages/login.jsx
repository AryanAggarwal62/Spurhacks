import { useState } from "react";
import { useNavigate } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
import { connectWallet } from "../services/api.js";
import { DEMO_MODE } from "../config.js";

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

  async function handleDemoLogin(demoWalletAddress) {
    setIsLoading(true);
    setError("");

    try {
      const userData = await connectWallet(demoWalletAddress);
      console.log('--- DEMO LOGIN ---');
      console.log('User data received from mock API:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to connect demo user.");
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-pink-200 ">
      <div className="card max-w-sm w-auto text-black">
        <form className="card-body" onSubmit={handleLogin}>
          <h2 className="card-title text-3xl font-bold mb-4 text-center text-primary">Task Chain</h2>
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
          
          {DEMO_MODE && (
            <div className="mt-6 text-center">
              <div className="divider text-sm text-gray-400">OR USE A DEMO ACCOUNT</div>
              <p className="text-xs text-gray-500 mb-3">See the app with pre-populated data.</p>
              <div className="flex gap-2 justify-center">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDemoLogin('0xAlice123')}
                  disabled={isLoading}
                >
                  Connect as Alice
                </button>
                <button 
                  className="btn btn-accent btn-sm"
                  onClick={() => handleDemoLogin('0xBob456')}
                  disabled={isLoading}
                >
                  Connect as Bob
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-500">
            <p>Requires MetaMask browser extension</p>
          </div>
        </div>
      </div>
    </div>
  );
}
