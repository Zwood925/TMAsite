import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createBlogPost(slug, title, description, subtitle, date, readTime, tags, content) {
    try {
        // Read the template
        const templatePath = path.join(__dirname, '../templates/blog-post-template.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace placeholders
        template = template.replace(/{{TITLE}}/g, title);
        template = template.replace(/{{DESCRIPTION}}/g, description);
        template = template.replace(/{{SUBTITLE}}/g, subtitle);
        template = template.replace(/{{DATE}}/g, date);
        template = template.replace(/{{READ_TIME}}/g, readTime);
        template = template.replace(/{{TAGS}}/g, tags);

        template = template.replace(/{{CONTENT}}/g, content);
        
        // Create the post directory
        const postDir = path.join(__dirname, '../posts', slug);
        if (!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir, { recursive: true });
        }
        
        // Write the post file
        const postPath = path.join(postDir, 'index.html');
        fs.writeFileSync(postPath, template);
        
        console.log(`✅ Blog post created: ${postPath}`);
        console.log(`🌐 URL: /posts/${slug}/`);
    } catch (error) {
        console.error('Error creating blog post:', error.message);
        process.exit(1);
    }
}

// Check if this script is being run directly
const args = process.argv.slice(2);

if (args.length < 7) {
    console.log(`
Usage: node create-blog-post.js <slug> <title> <description> <subtitle> <date> <readTime> <tags> [contentFile]

Example:
node create-blog-post.js "my-new-post" "My New Post Title" "This is the description" "This is the subtitle" "2025-01-15" "5 min read" "ai, business"
    `);
    process.exit(1);
}

const [slug, title, description, subtitle, date, readTime, tags, contentFile] = args;

let content = '';
if (contentFile && fs.existsSync(contentFile)) {
    content = fs.readFileSync(contentFile, 'utf8');
} else {
    content = `
<h2>Your content here</h2>
<p>Start writing your blog post content...</p>
    `;
}

createBlogPost(slug, title, description, subtitle, date, readTime, tags, content); 