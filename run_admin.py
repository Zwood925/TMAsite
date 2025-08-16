#!/usr/bin/env python3
"""
Blog Admin Server Runner
This script starts the Flask-based blog admin system.
"""

import os
import sys

# Add the blog_admin directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'blog_admin'))

# Import and run the Flask app
from blog_admin.src.main import app

if __name__ == '__main__':
    print("🍄 Starting The Mushroom Agency Blog Admin...")
    print("📍 Admin Panel: http://localhost:5000/admin/login")
    print("📍 Main Site: http://localhost:5000")
    print("🔑 Default Password: mushroom123")
    print("")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True) 