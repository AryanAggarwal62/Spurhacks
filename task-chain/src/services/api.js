const API_BASE_URL = 'http://127.0.0.1:5000/api';

// User Authentication
export const connectWallet = async (walletAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to connect wallet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Goals Management
export const createGoal = async (userId, title, description) => {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, title, description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const getUserGoals = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const completeGoal = async (goalId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/complete`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error completing goal:', error);
    throw error;
  }
};

// NFT Management
export const getUserNFTs = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch NFTs');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};

export const toggleNFTListing = async (nftId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts/${nftId}/list`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle NFT listing');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling NFT listing:', error);
    throw error;
  }
};

// Marketplace
export const getMarketplaceNFTs = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch marketplace');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    throw error;
  }
};

export const executeTrade = async (proposerUserId, proposerNftId, targetNftId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proposer_user_id: proposerUserId,
        proposer_nft_id: proposerNftId,
        target_nft_id: targetNftId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to execute trade');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error executing trade:', error);
    throw error;
  }
}; 