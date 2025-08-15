# Blog Posts Organization

This folder contains all your blog post markdown files. Here's how to organize them:

## Folder Structure

```
posts/
├── README.md (this file)
├── sample-post.md (example post)
├── ai-printing-press-moment.md (your existing post)
└── [future posts].md
```

## How to Add a New Blog Post

1. **Create a markdown file** in this folder with YAML front matter
2. **Run the conversion script**: `node scripts/md-to-blog.js posts/your-post.md`
3. **The script will automatically**:
   - Convert markdown to HTML
   - Create the post directory
   - Update the blog listing page
   - Add it to the correct category

## YAML Front Matter Format

Every markdown file must start with YAML front matter:

```yaml
---
title: "Your Post Title"
description: "Your post description"
subtitle: "Optional subtitle"
date: "2025-01-15"
category: "AI"  # AI, Automation, Business, News, Tutorials
readTime: "5 min read"
tags: "ai, business, automation"
---
```

## Categories

Use these categories for consistency:
- **AI** - Artificial intelligence topics
- **Automation** - Workflow automation
- **Business** - Business strategy and growth
- **News** - Industry news and updates
- **Tutorials** - Step-by-step guides

**Note:** Categories are case-insensitive. You can use "AI", "ai", "Automation", "automation", etc.

## Markdown Formatting

The script supports:
- **Headers**: `#`, `##`, `###`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Lists**: `* item` or `1. item`
- **Paragraphs**: Double line breaks

## Example Usage

```bash
# Create a new post
node scripts/md-to-blog.js posts/my-new-post.md

# The script will output:
# ✅ Blog post created: /path/to/posts/my-new-post/index.html
# 🌐 URL: /posts/my-new-post/
# 📝 Title: Your Post Title
# 📅 Date: 2025-01-15
# 🏷️ Category: AI
```

## Tips

- Use descriptive filenames
- Keep titles under 60 characters
- Write compelling descriptions
- Use relevant tags for SEO
- Test your post locally before publishing 