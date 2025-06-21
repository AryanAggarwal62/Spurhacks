from flask import Blueprint, request, jsonify
from src.db import get_db
from datetime import datetime
from bson.objectid import ObjectId
from .nfts import mint_nft_for_user

bp = Blueprint('goals', __name__, url_prefix='/api/goals')

@bp.route('', methods=['POST'])
def create_goal():
    """
    Creates a new goal for a user.
    """
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description')

    if not all([user_id, title, description]):
        return jsonify({"error": "user_id, title, and description are required"}), 400

    db = get_db()
    
    # Check if the user exists
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_goal = {
        "user_id": ObjectId(user_id),
        "title": title,
        "description": description,
        "status": "active", # Can be 'active', 'completed'
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    
    result = db.goals.insert_one(new_goal)
    new_goal['_id'] = str(result.inserted_id)
    new_goal['user_id'] = str(new_goal['user_id'])
    
    return jsonify(new_goal), 201

@bp.route('/user/<user_id>', methods=['GET'])
def get_user_goals(user_id):
    """
    Retrieves all goals for a specific user.
    """
    db = get_db()
    
    # Check if the user exists
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    goals_cursor = db.goals.find({"user_id": ObjectId(user_id)})
    goals_list = []
    for goal in goals_cursor:
        goal['_id'] = str(goal['_id'])
        goal['user_id'] = str(goal['user_id'])
        goals_list.append(goal)
        
    return jsonify(goals_list), 200

@bp.route('/<goal_id>/complete', methods=['PUT'])
def complete_goal(goal_id):
    """
    Marks a specific goal as completed.
    """
    db = get_db()
    
    # Find the goal by its ID
    goal = db.goals.find_one({"_id": ObjectId(goal_id)})
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    # Prevent minting an NFT for a goal that is already complete
    if goal.get('status') == 'completed':
        # Return the existing goal data without minting a new NFT
        goal['_id'] = str(goal['_id'])
        goal['user_id'] = str(goal['user_id'])
        return jsonify(goal), 200

    # Update the goal's status and completed_at timestamp
    update_result = db.goals.update_one(
        {"_id": ObjectId(goal_id)},
        {
            "$set": {
                "status": "completed",
                "completed_at": datetime.utcnow()
            }
        }
    )

    # If the update was successful, mint a new NFT for the user
    if update_result.modified_count > 0:
        mint_nft_for_user(user_id=str(goal['user_id']), goal_id=goal_id)

    # Retrieve the updated goal to return it
    updated_goal = db.goals.find_one({"_id": ObjectId(goal_id)})
    updated_goal['_id'] = str(updated_goal['_id'])
    updated_goal['user_id'] = str(updated_goal['user_id'])
    
    return jsonify(updated_goal), 200 