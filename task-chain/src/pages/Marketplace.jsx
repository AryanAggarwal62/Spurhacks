import { useState, useEffect } from "react";
import { getMarketplaceNFTs, getUserNFTs, toggleNFTListing, executeTrade } from "../services/api.js";

export default function Marketplace() {
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
      loadData();
    }
  }, [user._id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [marketplaceData, userNFTsData] = await Promise.all([
        getMarketplaceNFTs(user._id),
        getUserNFTs(user._id)
      ]);
      setMarketplaceNFTs(marketplaceData);
      setUserNFTs(userNFTsData);
    } catch (error) {
      setError("Failed to load marketplace data");
      console.error("Error loading marketplace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListing = async (nftId) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await toggleNFTListing(nftId, user._id);
      setSuccess("NFT listing status updated!");
      loadData(); // Reload data
    } catch (error) {
      setError("Failed to update NFT listing");
      console.error("Error toggling listing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrade = async (targetNftId) => {
    if (!selectedNFT) {
      setError("Please select one of your NFTs to trade");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await executeTrade(user._id, selectedNFT._id, targetNftId);
      setSuccess("Trade completed successfully!");
      setSelectedNFT(null);
      loadData(); // Reload data
    } catch (error) {
      setError("Failed to execute trade");
      console.error("Error executing trade:", error);
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
      <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
      
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Your NFTs */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Your NFTs</h3>
            {isLoading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading...</p>
              </div>
            ) : userNFTs.length === 0 ? (
              <p className="text-gray-500">No NFTs yet. Complete some goals to earn rewards!</p>
            ) : (
              <div className="space-y-3">
                {userNFTs.map((nft) => (
                  <div 
                    key={nft._id} 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedNFT?._id === nft._id ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedNFT(nft)}
                  >
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
                      <div className="text-right">
                        <button 
                          className={`btn btn-xs ${nft.listed ? 'btn-success' : 'btn-outline'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleListing(nft._id);
                          }}
                          disabled={isLoading}
                        >
                          {nft.listed ? 'Listed' : 'List'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available for Trade */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Available for Trade</h3>
            {isLoading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading...</p>
              </div>
            ) : marketplaceNFTs.length === 0 ? (
              <p className="text-gray-500">No NFTs available for trade.</p>
            ) : (
              <div className="space-y-3">
                {marketplaceNFTs.map((nft) => (
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
                        <p className="text-xs text-gray-500 mt-1">
                          Owner: {nft.user_id.slice(-8)}...
                        </p>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTrade(nft._id)}
                        disabled={!selectedNFT || isLoading}
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedNFT && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg">
          <p className="text-sm">
            <strong>Selected for trade:</strong> {selectedNFT.name} ({selectedNFT.rarity})
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Click "Trade" on any available NFT to complete the exchange.
          </p>
        </div>
      )}
    </div>
  );
}
