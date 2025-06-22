// A mock database to simulate state changes
let mockDb = {
  users: {},
  goals: {},
  nfts: {},
};

const nftImages = {
    Common: ['/nfts/common1.png', '/nfts/common2.png'],
    Rare: ['/nfts/rare1.png', '/nfts/rare2.png'],
    Epic: ['/nfts/epic1.png', '/nfts/epic2.png'],
    Legendary: ['/nfts/legendary1.png', '/nfts/legendary2.png'],
};

const getRandomImage = (rarity) => {
    const images = nftImages[rarity] || ['/nfts/common1.png']; // Fallback
    return images[Math.floor(Math.random() * images.length)];
};

// --- Helper function to reset the DB for a clean state ---
const resetMockDb = () => {
  mockDb = {
    users: {
      "user-alice": {
        _id: "user-alice",
        wallet_address: "0xAlice123",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        nfts: ["nft-1", "nft-2", "nft-5", "nft-6", "nft-7"],
      },
      "user-bob": {
        _id: "user-bob",
        wallet_address: "0xBob456",
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        nfts: ["nft-3", "nft-8"],
      },
      "user-charlie": {
        _id: "user-charlie",
        wallet_address: "0xCharlie789",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        nfts: ["nft-4"],
      },
    },
    goals: {
      // Alice's Goals
      "goal-1": { _id: "goal-1", user_id: "user-alice", title: "Run a 5K", description: "Train for and complete a 5-kilometer run.", status: "completed", created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), completed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
      "goal-2": { _id: "goal-2", user_id: "user-alice", title: "Read 10 Books", description: "Finish reading 10 books from my 'to-read' list.", status: "active", created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), completed_at: null },
      "goal-5": { _id: "goal-5", user_id: "user-alice", title: "Learn to Cook a New Dish", description: "Master the art of making sourdough bread.", status: "completed", created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      "goal-6": { _id: "goal-6", user_id: "user-alice", title: "Build a Portfolio Website", description: "Code and deploy a personal portfolio.", status: "completed", created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      "goal-7": { _id: "goal-7", user_id: "user-alice", title: "Daily Meditation", description: "Meditate for 15 minutes every morning for a month.", status: "active", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), completed_at: null },
      
      // Bob's Goals
      "goal-3": { _id: "goal-3", user_id: "user-bob", title: "Learn Guitar", description: "Practice guitar for 30 minutes every day.", status: "active", created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), completed_at: null },
      "goal-8": { _id: "goal-8", user_id: "user-bob", title: "Finish a Painting", description: "Complete the oil painting of the mountain landscape.", status: "completed", created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      "goal-9": { _id: "goal-9", user_id: "user-bob", title: "Organize Garage", description: "Clean out and organize the entire garage.", status: "active", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), completed_at: null },
    },
    nfts: {
      "nft-1": { _id: "nft-1", user_id: "user-alice", goal_id: "goal-1", name: "Epic Finisher Medal", description: "Awarded for completing the 5K run.", rarity: "Epic", image_url: getRandomImage("Epic"), listed: true, created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
      "nft-2": { _id: "nft-2", user_id: "user-alice", goal_id: "goal-generic", name: "Rune of Persistence", description: "A token of your continued progress.", rarity: "Common", image_url: getRandomImage("Common"), listed: false, created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },
      "nft-5": { _id: "nft-5", user_id: "user-alice", goal_id: "goal-5", name: "Chef's Spoon of Plenty", description: "For mastering a new culinary skill.", rarity: "Rare", image_url: getRandomImage("Rare"), listed: true, created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      "nft-6": { _id: "nft-6", user_id: "user-alice", goal_id: "goal-6", name: "The Architect's Key", description: "Proof of creation in the digital realm.", rarity: "Epic", image_url: getRandomImage("Epic"), listed: false, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      "nft-7": { _id: "nft-7", user_id: "user-alice", goal_id: "goal-generic", name: "Spark of Diligence", description: "Another step on the long journey.", rarity: "Common", image_url: getRandomImage("Common"), listed: false, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      
      "nft-3": { _id: "nft-3", user_id: "user-bob", goal_id: "goal-generic-2", name: "Bard's Lute", description: "For the dedication to learning a new instrument.", rarity: "Rare", image_url: getRandomImage("Rare"), listed: true, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      "nft-8": { _id: "nft-8", user_id: "user-bob", goal_id: "goal-8", name: "Painter's Perfect Prism", description: "For bringing color and life to the canvas.", rarity: "Rare", image_url: getRandomImage("Rare"), listed: false, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },

      "nft-4": { _id: "nft-4", user_id: "user-charlie", goal_id: "goal-generic-3", name: "The Worldforger's Hammer", description: "A testament to true mastery and creation.", rarity: "Legendary", image_url: getRandomImage("Legendary"), listed: true, created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    },
  };
};

resetMockDb(); // Initialize with default data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectWallet = async (walletAddress) => {
  await delay(300);
  let user = Object.values(mockDb.users).find(u => u.wallet_address === walletAddress);
  if (!user) {
    const newId = `user-${Math.random().toString(36).substr(2, 9)}`;
    user = { _id: newId, wallet_address: walletAddress, created_at: new Date().toISOString(), nfts: [] };
    mockDb.users[newId] = user;
  }
  return { ...user };
};

export const createGoal = async (userId, title, description) => {
  await delay(300);
  const newId = `goal-${Math.random().toString(36).substr(2, 9)}`;
  const newGoal = { _id: newId, user_id: userId, title, description, status: "active", created_at: new Date().toISOString(), completed_at: null };
  mockDb.goals[newId] = newGoal;
  return { ...newGoal };
};

export const getUserGoals = async (userId) => {
  await delay(300);
  return Object.values(mockDb.goals).filter(g => g.user_id === userId);
};

export const completeGoal = async (goalId) => {
  await delay(500);
  const goal = mockDb.goals[goalId];
  if (goal.status === 'completed') return { ...goal };

  goal.status = "completed";
  goal.completed_at = new Date().toISOString();

  // Mint a new NFT
  const rarities = ["Common", "Rare", "Epic", "Legendary"];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const newNftId = `nft-${Math.random().toString(36).substr(2, 9)}`;
  const newNft = {
    _id: newNftId,
    user_id: goal.user_id,
    goal_id: goalId,
    name: `${rarity} Reward`,
    description: "A unique reward for your dedication.",
    rarity,
    image_url: getRandomImage(rarity),
    listed: false,
    created_at: new Date().toISOString(),
  };
  mockDb.nfts[newNftId] = newNft;
  mockDb.users[goal.user_id].nfts.push(newNftId);

  return { ...goal };
};

export const getUserNFTs = async (userId) => {
  await delay(300);
  const user = mockDb.users[userId];
  if (!user) return [];
  return user.nfts.map(nftId => mockDb.nfts[nftId]);
};

export const toggleNFTListing = async (nftId, userId) => {
  await delay(200);
  if (mockDb.nfts[nftId]) {
    mockDb.nfts[nftId].listed = !mockDb.nfts[nftId].listed;
    return { success: true, listed: mockDb.nfts[nftId].listed };
  }
  return { success: false, message: "NFT not found" };
};

export const getMarketplaceNFTs = async (userId) => {
  await delay(300);
  const marketplaceNfts = Object.values(mockDb.nfts).filter(n => n.listed && n.user_id !== userId);
  
  // Add owner info, similar to a real API populating user data
  return marketplaceNfts.map(nft => {
    const owner = Object.values(mockDb.users).find(u => u._id === nft.user_id);
    return {
      ...nft,
      owner: {
        _id: owner?._id,
        wallet_address: owner?.wallet_address || 'Unknown'
      }
    }
  });
};

export const executeTrade = async (proposerUserId, proposerNftId, targetNftId) => {
  await delay(500);
  const proposer = mockDb.users[proposerUserId];
  const proposerNft = mockDb.nfts[proposerNftId];
  const targetNft = mockDb.nfts[targetNftId];
  const targetUser = mockDb.users[targetNft.user_id];

  // Swap owner
  proposerNft.user_id = targetUser._id;
  targetNft.user_id = proposer._id;

  // Unlist them
  proposerNft.listed = false;
  targetNft.listed = false;

  // Swap in user profiles
  proposer.nfts = proposer.nfts.filter(id => id !== proposerNftId);
  proposer.nfts.push(targetNftId);
  targetUser.nfts = targetUser.nfts.filter(id => id !== targetNftId);
  targetUser.nfts.push(proposerNftId);

  return { success: true, message: "Trade completed!" };
};

// Call this to reset the demo state if needed
export const resetDemo = () => {
  resetMockDb();
}; 