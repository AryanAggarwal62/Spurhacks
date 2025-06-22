import { useState, useEffect } from "react";
import { getMarketplaceNFTs, getUserNFTs, toggleNFTListing, executeTrade } from "../services/api.js";

export default function Marketplace() {
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [tradeTargetNFT, setTradeTargetNFT] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);

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

  const handleTradeClick = (targetNftId) => {
    setTradeTargetNFT(targetNftId);
    setShowTradeModal(true);
  };

  const handleConfirmTrade = async (userNftId) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const tradedNft = marketplaceNFTs.find(nft => nft._id === tradeTargetNFT);
      const selectedUserNft = userNFTs.find(nft => nft._id === userNftId);
      if (!tradedNft || !selectedUserNft) throw new Error("NFT not found");
      setUserNFTs(prev => [
        ...prev.filter(nft => nft._id !== userNftId),
        { ...tradedNft, owner: { ...tradedNft.owner, wallet_address: user.wallet_address } }
      ]);
      setMarketplaceNFTs(prev => [
        ...prev.filter(nft => nft._id !== tradeTargetNFT),
        { ...selectedUserNft, owner: { ...selectedUserNft.owner, wallet_address: tradedNft.owner.wallet_address } }
      ]);
      setSuccess("Trade completed successfully!");
      setShowTradeModal(false);
      setTradeTargetNFT(null);
      setSelectedNFT(null);
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
      <h2 className="text-6xl font-bold mb-4 text-black">Marketplace</h2>
      
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

      <div className="grid gap-6 md:grid-cols-2 text-black">
        {/* Your NFTs */}
        <div className="card bg-base-100 shadow-md rounded-lg">
          <div className="card-body">
            <h3 className="card-title m-4 font-bold text-2xl">Your NFTs</h3>
            {isLoading ? (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading...</p>
              </div>
            ) : userNFTs.length === 0 ? (
              <p className="text-gray-500 mx-4">No NFTs yet. Complete some goals to earn rewards!</p>
            ) : (
              <div className="space-y-3">
                {userNFTs.map((nft) => (
                  <div 
                    key={nft._id} 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center space-x-4 ${
                      selectedNFT?._id === nft._id ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedNFT(nft)}
                  >
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
                        <div className="text-right">
                          <button 
                            className={`btn btn-xs ${nft.listed ? 'btn-success text-white' : 'btn-outline text-white'}`}
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available for Trade */}
        <div className="card bg-base-100 shadow-md rounded-lg">
          <div className="card-body">
            <h3 className="card-title m-4 font-bold text-2xl">Available for Trade</h3>
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
                          <p className="text-xs text-gray-500 mt-1">
                            Owner: {nft.owner.wallet_address.slice(0, 6)}...{nft.owner.wallet_address.slice(-4)}
                          </p>
                        </div>
                        <button 
                          className="btn btn-primary btn-sm text-white"
                          onClick={() => handleTradeClick(nft._id)}
                          disabled={isLoading}
                        >
                          Trade
                        </button>
                      </div>
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

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 bg-white text-black">Select one of your collectibles to trade</h3>
            <div className="grid grid-cols-1 gap-3">
              {userNFTs.map(nft => (
                <div key={nft._id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={nft.image_url} alt={nft.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-semibold text-black">{nft.name}</span>
                  </div>
                  <button
                    className="btn btn-success btn-xs text-white"
                    onClick={() => handleConfirmTrade(nft._id)}
                    disabled={isLoading}
                  >
                    Trade this
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm mt-4 w-full" onClick={() => setShowTradeModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
