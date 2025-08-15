import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // Wrap lists
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|o]|<li>)(.*$)/gim, '<p>$1</p>')
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|u|o][^>]*>)/g, '$1')
        .replace(/(<\/[h|u|o][^>]*>)<\/p>/g, '$1');
}

function parseFrontMatter(content) {
    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
        throw new Error('No front matter found. Please add YAML front matter to your markdown file.');
    }
    
    const frontMatter = match[1];
    const markdownContent = match[2];
    
    const metadata = {};
    frontMatter.split(/\r?\n/).forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            metadata[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        }
    });
    

    
    return { metadata, markdownContent };
}

function createBlogPost(mdFilePath) {
    try {
        const content = fs.readFileSync(mdFilePath, 'utf8');
        const { metadata, markdownContent } = parseFrontMatter(content);
        
        // Validate required fields
        const required = ['title', 'description', 'date', 'category', 'readTime'];
        for (const field of required) {
            if (!metadata[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate category
        const validCategories = ['ai', 'automation', 'business', 'news', 'tutorials'];
        if (!validCategories.includes(metadata.category.toLowerCase())) {
            throw new Error(`Invalid category: ${metadata.category}. Valid categories are: ${validCategories.join(', ')}`);
        }
        
        // Generate slug from title
        const slug = metadata.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        // Convert markdown to HTML
        const htmlContent = markdownToHtml(markdownContent);
        
        // Read template
        const templatePath = path.join(__dirname, '../templates/blog-post-template.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace placeholders
        template = template.replace(/{{TITLE}}/g, metadata.title);
        template = template.replace(/{{DESCRIPTION}}/g, metadata.description);
        template = template.replace(/{{SUBTITLE}}/g, metadata.subtitle || metadata.description);
        template = template.replace(/{{DATE}}/g, metadata.date);
        template = template.replace(/{{READ_TIME}}/g, metadata.readTime);
        template = template.replace(/{{TAGS}}/g, metadata.tags || metadata.category);
        template = template.replace(/{{IMAGE}}/g, metadata.image || 'ChatGPTImageJul24202508_27_40PM.png');
        template = template.replace(/{{CONTENT}}/g, htmlContent);
        
        // Create the post directory
        const postDir = path.join(__dirname, '../posts', slug);
        if (!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir, { recursive: true });
        }
        
        // Write the post file
        const postPath = path.join(postDir, 'index.html');
        fs.writeFileSync(postPath, template);
        
        // Update blog listing
        updateBlogListing(metadata, slug);
        
        console.log(`✅ Blog post created: ${postPath}`);
        console.log(`🌐 URL: /posts/${slug}/`);
        console.log(`📝 Title: ${metadata.title}`);
        console.log(`📅 Date: ${metadata.date}`);
        console.log(`🏷️ Category: ${metadata.category}`);
        
        return { slug, metadata };
        
    } catch (error) {
        console.error('Error creating blog post:', error.message);
        process.exit(1);
    }
}

function updateBlogListing(postMetadata, slug) {
    const blogHtmlPath = path.join(__dirname, '../blog.html');
    let blogHtml = fs.readFileSync(blogHtmlPath, 'utf8');
    
    // Create new post card HTML
    const postCard = `
        <article class="post-card" data-category="${postMetadata.category.toLowerCase()}">
          <div class="post-image">
            <img src="${postMetadata.image || 'ChatGPTImageJul24202508_27_40PM.png'}" alt="${postMetadata.title}" />
            <div class="post-category">${postMetadata.category}</div>
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="date">${postMetadata.date}</span>
              <span class="read-time">${postMetadata.readTime}</span>
            </div>
            <h3>${postMetadata.title}</h3>
            <p>${postMetadata.description}</p>
            <div class="post-footer">
              <a class="read-more" href="posts/${slug}/">Read More</a>
              <div class="post-stats">
                <span><i class="fas fa-eye"></i> 0</span>
                <span><i class="fas fa-heart"></i> 0</span>
              </div>
            </div>
          </div>
        </article>`;
    
    // Find the posts grid and replace it with the new post card
    // This will replace any existing posts with just the new one
    const postsGridRegex = /(<div class="posts-grid">)[\s\S]*?(<\/div>)/;
    const newPostsGrid = `$1${postCard}$2`;
    
    if (blogHtml.match(postsGridRegex)) {
        blogHtml = blogHtml.replace(postsGridRegex, newPostsGrid);
        fs.writeFileSync(blogHtmlPath, blogHtml);
        console.log('✅ Blog listing updated');
    } else {
        console.log('⚠️ Could not find posts-grid in blog.html');
    }
}

// Check if this script is being run directly
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
Usage: node md-to-blog.js <markdown-file>

Example:
node md-to-blog.js posts/my-new-post.md

Your markdown file should have YAML front matter like this:
---
title: "Your Post Title"
description: "Your post description"
subtitle: "Optional subtitle"
date: "2025-01-15"
category: "AI"
readTime: "5 min read"
tags: "ai, business, automation"
---

Your markdown content here...
    `);
    process.exit(1);
}

const mdFilePath = args[0];
if (!fs.existsSync(mdFilePath)) {
    console.error(`Error: File ${mdFilePath} not found`);
    process.exit(1);
}

createBlogPost(mdFilePath); 