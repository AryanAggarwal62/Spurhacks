import { useState, useEffect } from "react";
import { getUserNFTs, toggleNFTListing } from "../services/api.js";

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

  const handleToggleListing = async (nftId) => {
    try {
      // Optimistically update the UI
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft._id === nftId ? { ...nft, listed: !nft.listed } : nft
        )
      );
      await toggleNFTListing(nftId, user._id);
    } catch (error) {
      console.error("Failed to toggle listing", error);
      // Revert the UI change on error
      loadNFTs(); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    // Redirect to login page
    window.location.href = '/login';
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
        <h2 className="text-6xl text-black font-bold">Profile</h2>
        <button className="btn btn-outline btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <div className="card shadow-lg rounded-lg">
          <div className="card-body m-4">
            <h3 className="card-title mx-4 text-2xl font-bold text-black">User Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mx-2 my-4">
              {/* Wallet Address Tile */}
              <div className="bg-blue-400 rounded-lg shadow flex flex-col items-center justify-center min-h-[110px] min-w-0 h-full w-full p-3">
                <span className="font-bold text-2xl text-white mb-1">Wallet</span>
                <p className="text-xs text-white break-all text-center font-mono">{user.wallet_address}</p>
              </div>
              {/* Member Since Tile */}
              <div className="bg-green-400 rounded-lg shadow flex flex-col items-center justify-center min-h-[110px] min-w-0 h-full w-full p-3">
                <span className="font-bold text-2xl text-white mb-1">Member</span>
                <p className="text-base text-white font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              {/* Total NFTs Tile */}
              <div className="bg-purple-500 rounded-lg shadow flex flex-col items-center justify-center min-h-[110px] min-w-0 h-full w-full p-3">
                <span className="font-bold text-2xl text-white mb-1">NFTs</span>
                <p className="text-3xl text-white font-extrabold">{nfts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        <div className="card shadow-lg rounded-lg">
          <div className="card-body my-4">
            <h3 className="card-title mx-4 text-2xl font-bold text-black">NFT Collection</h3>
            {isLoading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md text-neutral"></span>
                <span className="font-bold text-2xl text-white mb-1">Loading NFTs...</span>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : nfts.length === 0 ? (
              <p className="text-gray-500">No NFTs yet. Complete some goals to earn rewards!</p>
            ) : (
              <div className="space-y-3 text-black m-4">
                {nfts.map((nft) => (
                  <div key={nft._id} className="border rounded-lg p-3 flex items-center space-x-4">
                    <img src={nft.image_url} alt={nft.name} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-grow">
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
                          <p>Minted: {new Date(nft.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right text-xs">
                          <button 
                            className={`btn btn-xs ${nft.listed ? 'btn-warning text-white' : 'btn-success text-white'}`}
                            onClick={() => handleToggleListing(nft._id)}
                          >
                            {nft.listed ? 'Unlist' : 'List on Market'}
                          </button>
                        </div>
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
