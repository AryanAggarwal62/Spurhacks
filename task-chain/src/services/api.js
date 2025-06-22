import { DEMO_MODE } from '../config';
import * as mockApi from './mockApi';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const realApi = {
  async connectWallet(walletAddress) {
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
  },

  // Goals Management
  async createGoal(userId, title, description) {
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
  },

  async getUserGoals(userId) {
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
  },

  async completeGoal(goalId) {
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
  },

  // NFT Management
  async getUserNFTs(userId) {
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
  },

  async toggleNFTListing(nftId, userId) {
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
  },

  // Marketplace
  async getMarketplaceNFTs(userId) {
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
  },

  async executeTrade(proposerUserId, proposerNftId, targetNftId) {
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
  },
};

const api = DEMO_MODE ? mockApi : realApi;

export const {
  connectWallet,
  createGoal,
  getUserGoals,
  completeGoal,
  getUserNFTs,
  toggleNFTListing,
  getMarketplaceNFTs,
  executeTrade,
} = api; 