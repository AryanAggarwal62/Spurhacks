import random
from datetime import datetime
from bson.objectid import ObjectId
from flask import Blueprint, jsonify, request
from src.db import get_db

bp = Blueprint('nfts', __name__, url_prefix='/api/nfts')

@bp.route('/user/<user_id>', methods=['GET'])
def get_user_nfts(user_id):
    """
    Retrieves all NFT documents owned by a specific user.
    """
    db = get_db()
    
    # Check if the user exists
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Find all NFTs where the _id is in the user's nfts list
    nft_ids = user.get('nfts', [])
    nfts_cursor = db.nfts.find({"_id": {"$in": nft_ids}})
    
    nfts_list = []
    for nft in nfts_cursor:
        nft['_id'] = str(nft['_id'])
        nft['user_id'] = str(nft['user_id'])
        nft['goal_id'] = str(nft['goal_id'])
        nfts_list.append(nft)
        
    return jsonify(nfts_list), 200

@bp.route('/<nft_id>/list', methods=['PUT'])
def toggle_nft_listing(nft_id):
    """
    Toggles the 'listed' status of an NFT.
    """
    data = request.get_json()
    # In a real app, you'd verify the user_id owns this NFT
    # For the MVP, we'll trust the request.
    user_id = data.get('user_id') 

    db = get_db()
    nft = db.nfts.find_one({"_id": ObjectId(nft_id), "user_id": ObjectId(user_id)})

    if not nft:
        return jsonify({"error": "NFT not found or user does not own it"}), 404

    # Toggle the 'listed' status
    new_status = not nft.get('listed', False)
    db.nfts.update_one(
        {"_id": ObjectId(nft_id)},
        {"$set": {"listed": new_status}}
    )

    return jsonify({"success": True, "listed": new_status}), 200

def mint_nft_for_user(user_id, goal_id):
    """
    "Mints" a new NFT for a user upon goal completion.
    This creates an NFT document in the database with random rarity.
    """
    db = get_db()

    # Define rarities and their weights
    rarities = {
        "Common": 60,
        "Rare": 25,
        "Epic": 10,
        "Legendary": 5
    }
    
    # Choose a random rarity based on the weights
    rarity_choice = random.choices(list(rarities.keys()), weights=list(rarities.values()), k=1)[0]

    new_nft = {
        "user_id": ObjectId(user_id),
        "goal_id": ObjectId(goal_id),
        "minted_at": datetime.utcnow(),
        "rarity": rarity_choice,
        "name": f"{rarity_choice} Reward",
        "description": "A unique reward for completing a goal.",
        "image_url": f"https://example.com/images/{rarity_choice.lower()}.png", # Placeholder image
        "listed": False # Not listed for trade by default
    }

    # Insert the new NFT into the 'nfts' collection
    result = db.nfts.insert_one(new_nft)
    nft_id = result.inserted_id

    # Add the NFT's ID to the user's list of NFTs
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"nfts": nft_id}}
    )
    
    # Return the newly created NFT's ID
    return nft_id 