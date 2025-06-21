import os
from flask import Flask
from flask_cors import CORS

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    CORS(app)

    # Initialize database connection
    from . import db
    db.init_app(app)

    @app.route('/health')
    def health_check():
        """Health check endpoint to confirm the server is running."""
        return "Backend is running!"

    # Register blueprints for different parts of the application
    from .routes import auth, goals, nfts, marketplace
    app.register_blueprint(auth.bp)
    app.register_blueprint(goals.bp)
    app.register_blueprint(nfts.bp)
    app.register_blueprint(marketplace.bp)

    return app 