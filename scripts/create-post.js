#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createNewPost() {
    console.log('🍄 Welcome to The Mushroom Agency Blog Post Creator! 🍄\n');
    
    try {
        // Get post details
        const title = await question('📝 Post title: ');
        const subtitle = await question('📄 Subtitle (optional): ');
        const category = await question('🏷️  Category (ai/automation/business/news/tutorials): ');
        const readTime = await question('⏱️  Read time (e.g., "5 min read"): ');
        const imagePath = await question('🖼️  Image filename (or press Enter for default): ') || 'ChatGPTImageJul24202508_27_40PM.png';
        
        // Validate category
        const validCategories = ['ai', 'automation', 'business', 'news', 'tutorials'];
        if (!validCategories.includes(category.toLowerCase())) {
            throw new Error(`Invalid category: ${category}. Valid categories are: ${validCategories.join(', ')}`);
        }
        
        // Create slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        // Create markdown content
        const markdownContent = `---
title: "${title}"
subtitle: "${subtitle}"
category: "${category}"
date: "${new Date().toISOString().split('T')[0]}"
readTime: "${readTime}"
image: "${imagePath}"
---

# ${title}

${subtitle ? `> ${subtitle}` : ''}

## Introduction

Start your blog post here...

## Main Content

Add your main content here...

### Key Points

- Point 1
- Point 2
- Point 3

## Conclusion

Wrap up your post here...

---

*Need help implementing this? [Book a free call](https://your-site.com/contact) with The Mushroom Agency!*
`;
        
        // Create the markdown file
        const markdownPath = path.join(__dirname, '..', 'posts', `${slug}.md`);
        fs.writeFileSync(markdownPath, markdownContent);
        
        console.log(`\n✅ Created: ${markdownPath}`);
        
        // Ask if they want to convert to HTML now
        const convertNow = await question('\n🔄 Convert to HTML now? (y/n): ');
        
        if (convertNow.toLowerCase() === 'y' || convertNow.toLowerCase() === 'yes') {
            console.log('\n🔄 Converting to HTML...');
            
            // Import and run the conversion script
            const { createBlogPost } = await import('./md-to-blog.js');
            await createBlogPost(markdownPath);
            
            console.log('✅ HTML created successfully!');
        }
        
        console.log('\n🎉 Your blog post is ready!');
        console.log(`📝 Edit the markdown file: ${markdownPath}`);
        console.log('🚀 Run "npm run new-post" to convert to HTML when ready');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

createNewPost(); 