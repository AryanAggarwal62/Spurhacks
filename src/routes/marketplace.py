from flask import Blueprint, jsonify, request
from src.db import get_db
from bson.objectid import ObjectId

bp = Blueprint('marketplace', __name__, url_prefix='/api/marketplace')

@bp.route('/<user_id>', methods=['GET'])
def get_listed_nfts(user_id):
    """
    Retrieves all NFTs that are listed for trade, excluding those
    owned by the user making the request.
    """
    db = get_db()

    pipeline = [
        {
            "$match": {
                "listed": True,
                "user_id": {"$ne": ObjectId(user_id)}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "owner"
            }
        },
        {
            "$unwind": "$owner"
        },
        {
            "$project": {
                "name": 1,
                "description": 1,
                "rarity": 1,
                "image_url": 1,
                "listed": 1,
                "created_at": 1,
                "goal_id": 1,
                "owner.wallet_address": 1,
                "owner._id": 1
            }
        }
    ]

    nfts_cursor = db.nfts.aggregate(pipeline)
    
    nfts_list = []
    for nft in nfts_cursor:
        nft['_id'] = str(nft['_id'])
        nft['goal_id'] = str(nft['goal_id'])
        nft['owner']['_id'] = str(nft['owner']['_id'])
        nfts_list.append(nft)
        
    return jsonify(nfts_list), 200

@bp.route('/trade', methods=['POST'])
def execute_trade():
    """
    Executes a direct 1-for-1 NFT trade between two users.
    """
    data = request.get_json()
    proposer_user_id = data.get('proposer_user_id')
    proposer_nft_id = data.get('proposer_nft_id')
    target_nft_id = data.get('target_nft_id')

    if not all([proposer_user_id, proposer_nft_id, target_nft_id]):
        return jsonify({"error": "proposer_user_id, proposer_nft_id, and target_nft_id are required"}), 400

    db = get_db()

    # --- Find all documents ---
    proposer_nft = db.nfts.find_one({"_id": ObjectId(proposer_nft_id), "user_id": ObjectId(proposer_user_id)})
    target_nft = db.nfts.find_one({"_id": ObjectId(target_nft_id), "listed": True})

    if not proposer_nft or not target_nft:
        return jsonify({"error": "One or both NFTs not found, or target NFT is not listed for trade."}), 404

    target_user_id = target_nft['user_id']

    # --- Atomically update the database ---
    # In a real-world application, this would be a single database transaction.
    
    # 1. Swap user_id on NFTs
    db.nfts.update_one({"_id": ObjectId(proposer_nft_id)}, {"$set": {"user_id": ObjectId(target_user_id), "listed": False}})
    db.nfts.update_one({"_id": ObjectId(target_nft_id)}, {"$set": {"user_id": ObjectId(proposer_user_id), "listed": False}})

    # 2. Swap NFT IDs in user profiles
    db.users.update_one({"_id": ObjectId(proposer_user_id)}, {"$pull": {"nfts": ObjectId(proposer_nft_id)}})
    db.users.update_one({"_id": ObjectId(proposer_user_id)}, {"$push": {"nfts": ObjectId(target_nft_id)}})

    db.users.update_one({"_id": ObjectId(target_user_id)}, {"$pull": {"nfts": ObjectId(target_nft_id)}})
    db.users.update_one({"_id": ObjectId(target_user_id)}, {"$push": {"nfts": ObjectId(proposer_nft_id)}})

    return jsonify({"success": True, "message": "Trade completed successfully."}), 200 