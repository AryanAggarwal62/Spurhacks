import { useState, useEffect } from "react";
import { getUserNFTs } from "../services/api.js";

export default function Profile({ onLogout }) {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
      loadNFTs();
    }
  }, [user._id]);

  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      const nftsData = await getUserNFTs(user._id);
      setNfts(nftsData);
    } catch (error) {
      setError("Failed to load NFTs");
      console.error("Error loading NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button className="btn btn-outline btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">User Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Wallet Address:</span>
                <p className="text-sm text-gray-600 break-all">{user.wallet_address}</p>
              </div>
              <div>
                <span className="font-semibold">Member Since:</span>
                <p className="text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-semibold">Total NFTs:</span>
                <p className="text-sm text-gray-600">{nfts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">NFT Collection</h3>
            {isLoading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading NFTs...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : nfts.length === 0 ? (
              <p className="text-gray-500">No NFTs yet. Complete some goals to earn rewards!</p>
            ) : (
              <div className="space-y-3">
                {nfts.map((nft) => (
                  <div key={nft._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{nft.name}</h4>
                        <p className="text-sm text-gray-600">{nft.description}</p>
                        <span className={`badge badge-sm ${
                          nft.rarity === 'Legendary' ? 'badge-error' :
                          nft.rarity === 'Epic' ? 'badge-warning' :
                          nft.rarity === 'Rare' ? 'badge-info' :
                          'badge-success'
                        }`}>
                          {nft.rarity}
                        </span>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>Minted: {new Date(nft.minted_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
