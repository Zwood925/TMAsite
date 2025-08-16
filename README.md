# The Mushroom Agency Website

AI Made Simple for Small Towns

## 🍄 About

This is the official website for The Mushroom Agency, featuring a modern blog system with a secure Flask-based admin panel.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TMAsite
   ```

2. **Install Python dependencies**
   ```bash
   cd blog_admin
   pip install -r requirements.txt
   cd ..
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

## 🎯 Running the Application

### Option 1: Flask Admin System (Recommended)
This runs both the main site and the admin panel through Flask:

```bash
npm run admin
```

- **Main Site**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login
- **Default Password**: `mushroom123`

### Option 2: Static Site Only
For development without the admin panel:

```bash
npm run dev
```

- **Site**: http://localhost:3000

## 📝 Blog Management

### Using the Admin Panel (Recommended)
1. Start the Flask server: `npm run admin`
2. Visit http://localhost:5000/admin/login
3. Login with password: `mushroom123`
4. Create, edit, and manage blog posts through the web interface

### Features
- ✅ WYSIWYG editor for blog content
- ✅ Image upload and management
- ✅ Category organization (AI, Automation, Business, News, Tutorials)
- ✅ SEO-friendly URLs
- ✅ Responsive design
- ✅ Secure admin authentication

### Legacy Scripts (Still Available)
- `npm run new-post` - Create new markdown posts
- `npm run convert-post` - Convert markdown to HTML
- `npm run build:blog` - Build static blog files

## 🏗️ Project Structure

```
TMAsite/
├── blog_admin/           # Flask admin system
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Database models
│   │   ├── templates/   # Admin templates
│   │   └── static/      # Admin assets
│   └── requirements.txt
├── images/              # Site images
├── posts/              # Blog post files
├── scripts/            # Build scripts
├── index.html          # Main site
├── blog.html           # Blog listing
├── post.html           # Individual post template
├── posts.json          # Blog data
├── styles.css          # Main styles
├── blog-styles.css     # Blog styles
└── run_admin.py        # Admin server runner
```

## 🔧 Configuration

### Admin Password
Set the environment variable to change the admin password:
```bash
export BLOG_ADMIN_PASSWORD="your-secure-password"
```

### Categories
Edit `blog_admin/src/routes/blog_admin.py` around line 150 to modify categories.

## 🚀 Deployment

### Static Site Deployment
The main site can be deployed as static files to any hosting service:
- Vercel
- Netlify
- GitHub Pages
- Traditional web hosting

### Admin System Deployment
For the admin system, you'll need a Python hosting service:
- Heroku
- PythonAnywhere
- DigitalOcean App Platform
- AWS/GCP with Python support

## 🛠️ Development

### Adding New Features
1. **Frontend**: Edit HTML/CSS/JS files in the root
2. **Admin**: Edit Flask files in `blog_admin/src/`
3. **Blog**: Use the admin panel or edit `posts.json` directly

### Database
The system uses SQLite for user management and JSON files for blog content, making it simple to deploy and maintain.

## 📞 Support

For questions or issues, contact The Mushroom Agency team.

---

**Built with ❤️ by The Mushroom Agency** 