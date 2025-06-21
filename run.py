import os
from src import create_app
from dotenv import load_dotenv

# Load environment variables from the .env file in the project root
load_dotenv()

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port) 