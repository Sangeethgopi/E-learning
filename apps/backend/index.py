import sys
import os

# Add the current directory to sys.path so 'app' can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# This is what Vercel looks for
export_app = app
