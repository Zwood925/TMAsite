from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime
import json
import os
import uuid
import re
from PIL import Image
import shutil

blog_admin_bp = Blueprint('blog_admin', __name__)

# Configuration - paths relative to the main TMAsite directory
MAIN_SITE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
POSTS_JSON_PATH = os.path.join(MAIN_SITE_DIR, 'posts.json')
POSTS_DIR = os.path.join(MAIN_SITE_DIR, 'posts')
IMAGES_DIR = os.path.join(MAIN_SITE_DIR, 'images', 'blog')
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ADMIN_PASSWORD = os.environ.get('BLOG_ADMIN_PASSWORD', 'mushroom123')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_posts_data():
    """Load the posts.json file"""
    if os.path.exists(POSTS_JSON_PATH):
        with open(POSTS_JSON_PATH, 'r') as f:
            return json.load(f)
    return {"posts": [], "lastUpdated": datetime.now().isoformat()}

def save_posts_data(data):
    """Save the posts.json file"""
    data["lastUpdated"] = datetime.now().isoformat()
    with open(POSTS_JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def create_slug(title):
    """Create URL-friendly slug from title"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def calculate_read_time(content):
    """Calculate estimated read time"""
    # Remove HTML tags for word count
    import re
    text = re.sub(r'<[^>]+>', '', content)
    words = len(text.split())
    minutes = max(1, round(words / 200))  # Average reading speed
    return f"{minutes} min read"

def create_post_html(post_data):
    """Create individual post HTML file"""
    post_dir = os.path.join(POSTS_DIR, post_data['id'])
    os.makedirs(post_dir, exist_ok=True)
    
    # Read the post template
    template_path = os.path.join(MAIN_SITE_DIR, 'templates', 'post.template.html')
    if os.path.exists(template_path):
        with open(template_path, 'r') as f:
            template = f.read()
    else:
        # Fallback basic template
        template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} — The Mushroom Agency</title>
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="../../blog-styles.css">
</head>
<body>
    <article>
        <h1>{{title}}</h1>
        <div class="post-meta">
            <span>{{date}}</span> • <span>{{readTime}}</span>
        </div>
        <div class="post-content">
            {{content}}
        </div>
    </article>
</body>
</html>"""
    
    # Replace template variables
    html_content = template.replace('{{title}}', post_data['title'])
    html_content = html_content.replace('{{date}}', post_data['date'])
    html_content = html_content.replace('{{readTime}}', post_data['readTime'])
    html_content = html_content.replace('{{content}}', post_data['content'])
    
    # Write the HTML file
    html_path = os.path.join(post_dir, 'index.html')
    with open(html_path, 'w') as f:
        f.write(html_content)

@blog_admin_bp.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin login"""
    if request.method == 'POST':
        password = request.form.get('password')
        if password == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect('/admin')
        else:
            return render_template('login.html', error='Invalid password')
    
    return render_template('login.html')

@blog_admin_bp.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    session.pop('admin_logged_in', None)
    return redirect('/')

@blog_admin_bp.route('/admin')
def admin_panel():
    """Admin panel"""
    if not session.get('admin_logged_in'):
        return redirect('/admin/login')
    
    posts_data = load_posts_data()
    return render_template('admin.html', posts=posts_data['posts'])

@blog_admin_bp.route('/admin/post', methods=['POST'])
def admin_create_post():
    """Create new post"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        
        # Generate post ID and slug
        post_id = create_slug(data['title'])
        
        # Calculate read time
        read_time = calculate_read_time(data.get('content', ''))
        
        # Create post data in the format expected by the static site
        post_data = {
            'id': post_id,
            'title': data['title'],
            'subtitle': data.get('subtitle', ''),
            'description': data['excerpt'],
            'category': data['category'].lower(),
            'date': datetime.now().strftime('%Y-%m-%d'),
            'readTime': read_time,
            'tags': data.get('tags', []),
            'coverImage': data.get('cover_image', ''),
            'content': data.get('content', ''),
            'published': data.get('status', 'published') == 'published',
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # Load existing posts
        posts_data = load_posts_data()
        
        # Add new post
        posts_data['posts'].append(post_data)
        
        # Sort posts: featured first, then by date
        posts_data['posts'].sort(key=lambda x: (not x.get('featured', False), x.get('date', '')), reverse=True)
        
        # Save posts.json
        save_posts_data(posts_data)
        
        # Create individual post HTML file
        create_post_html(post_data)
        
        return jsonify({'success': True, 'post_id': post_id})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@blog_admin_bp.route('/admin/post/<post_id>', methods=['PUT'])
def admin_update_post(post_id):
    """Update existing post"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        
        # Load existing posts
        posts_data = load_posts_data()
        post_index = None
        
        for i, post in enumerate(posts_data['posts']):
            if post['id'] == post_id:
                post_index = i
                break
        
        if post_index is None:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        # Calculate read time
        read_time = calculate_read_time(data.get('content', ''))
        
        # Update post data
        posts_data['posts'][post_index].update({
            'title': data['title'],
            'subtitle': data.get('subtitle', ''),
            'description': data['excerpt'],
            'category': data['category'].lower(),
            'readTime': read_time,
            'tags': data.get('tags', []),
            'coverImage': data.get('cover_image', ''),
            'content': data.get('content', ''),
            'published': data.get('status', 'published') == 'published',
            'updatedAt': datetime.now().isoformat()
        })
        
        # Sort posts: featured first, then by date
        posts_data['posts'].sort(key=lambda x: (not x.get('featured', False), x.get('date', '')), reverse=True)
        
        # Save posts.json
        save_posts_data(posts_data)
        
        # Update individual post HTML file
        create_post_html(posts_data['posts'][post_index])
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@blog_admin_bp.route('/admin/post/<post_id>', methods=['DELETE'])
def admin_delete_post(post_id):
    """Delete post"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        # Load posts
        posts_data = load_posts_data()
        posts_data['posts'] = [p for p in posts_data['posts'] if p['id'] != post_id]
        save_posts_data(posts_data)
        
        # Remove post directory
        post_dir = os.path.join(POSTS_DIR, post_id)
        if os.path.exists(post_dir):
            shutil.rmtree(post_dir)
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@blog_admin_bp.route('/admin/upload', methods=['POST'])
def admin_upload_image():
    """Upload image"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid conflicts
        name, ext = os.path.splitext(filename)
        filename = f"{name}_{int(datetime.now().timestamp())}{ext}"
        
        # Save to both locations for compatibility
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        os.makedirs(IMAGES_DIR, exist_ok=True)
        
        upload_path = os.path.join(UPLOADS_DIR, filename)
        blog_path = os.path.join(IMAGES_DIR, filename)
        
        file.save(upload_path)
        
        # Copy to blog images directory
        shutil.copy2(upload_path, blog_path)
        
        # Optimize image
        try:
            with Image.open(upload_path) as img:
                # Resize if too large
                if img.width > 1200:
                    ratio = 1200 / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                    img.save(upload_path, optimize=True, quality=85)
                    img.save(blog_path, optimize=True, quality=85)
        except Exception as e:
            print(f"Image optimization failed: {e}")
        
        return jsonify({
            'success': True, 
            'filename': filename, 
            'url': f'/uploads/{filename}',
            'blog_url': f'images/blog/{filename}'
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@blog_admin_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOADS_DIR, filename)

@blog_admin_bp.route('/api/posts')
def api_posts():
    """API endpoint for posts"""
    posts_data = load_posts_data()
    return jsonify(posts_data['posts'])

@blog_admin_bp.route('/api/post/<post_id>')
def api_get_post(post_id):
    """Get individual post data for editing"""
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        posts_data = load_posts_data()
        for post in posts_data['posts']:
            if post['id'] == post_id:
                return jsonify({'success': True, 'data': post})
        
        return jsonify({'success': False, 'error': 'Post not found'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@blog_admin_bp.route('/admin/edit/<post_id>')
def admin_edit_post(post_id):
    """Edit post page - loads post data directly into the form"""
    if not session.get('admin_logged_in'):
        return redirect('/admin/login')
    
    try:
        posts_data = load_posts_data()
        post = None
        
        for p in posts_data['posts']:
            if p['id'] == post_id:
                post = p
                break
        
        if not post:
            return redirect('/admin')
        
        return render_template('admin.html', edit_post=post, posts=posts_data['posts'])
        
    except Exception as e:
        return redirect('/admin')

