import os
from flask import current_app, g
from pymongo import MongoClient
from pymongo.server_api import ServerApi

def get_db():
    """
    Establishes a connection to the MongoDB database if one doesn't exist
    for the current application context, and returns the database instance.
    """
    if 'db' not in g:
        mongo_uri = current_app.config['MONGO_URI']
        # The 'goalforge' database name is already in the URI you provided
        db_name = mongo_uri.split('/')[-1].split('?')[0]
        
        # Create a new client and connect to the server
        g.client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        g.db = g.client[db_name]
        
        # Send a ping to confirm a successful connection
        try:
            g.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

    return g.db

def close_db(e=None):
    """
    Closes the database connection at the end of the request.
    """
    client = g.pop('client', None)
    if client is not None:
        client.close()

def init_app(app):
    """
    Registers the `close_db` function with the Flask app so it's called
    after each request. This is triggered by the application factory.
    """
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.teardown_appcontext(close_db) 