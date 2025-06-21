import functools
from datetime import datetime
from flask import Blueprint, request, jsonify
from src.db import get_db

# Create a Blueprint for authentication routes
bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/connect', methods=['POST'])
def connect_wallet():
    """
    Connects a user by their wallet address.
    If the user doesn't exist, a new one is created.
    """
    data = request.get_json()
    wallet_address = data.get('wallet_address')

    if not wallet_address:
        return jsonify({"error": "wallet_address is required"}), 400

    db = get_db()
    users_collection = db.users

    # Find the user by wallet address
    user = users_collection.find_one({"wallet_address": wallet_address})

    if user:
        # User exists, return their data
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        # Also convert any ObjectIds in the nfts list
        if 'nfts' in user and user['nfts']:
            user['nfts'] = [str(nft_id) for nft_id in user['nfts']]
            
        return jsonify(user), 200
    else:
        # User doesn't exist, create a new one
        new_user = {
            "wallet_address": wallet_address,
            "username": None, # User can set this later
            "created_at": datetime.utcnow(),
            "nfts": []
        }
        result = users_collection.insert_one(new_user)
        
        # Retrieve the newly created user to return it
        created_user = users_collection.find_one({"_id": result.inserted_id})
        created_user['_id'] = str(created_user['_id'])
        
        return jsonify(created_user), 201 