#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const OUT_DIR = path.join(ROOT, "posts");
const TEMPLATE_DIR = path.join(ROOT, "templates");

const blogTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, "blog.template.html"), "utf-8");
const postTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, "post.template.html"), "utf-8");

function readTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function renderPost(meta, html, readMins) {
  let out = postTemplate
    .replaceAll("{{TITLE}}", meta.title || "Untitled Post")
    .replaceAll("{{DESCRIPTION}}", meta.description || "")
    .replaceAll("{{COVER_IMAGE}}", meta.cover_image || "/public/og/default.jpg")
    .replaceAll("{{DATE}}", meta.date || new Date().toISOString().slice(0, 10))
    .replaceAll("{{READ_TIME}}", String(readMins))
    .replaceAll("{{TAGS}}", Array.isArray(meta.tags) ? meta.tags.join(", ") : (meta.tags || ""))
    .replaceAll("{{CONTENT}}", html)
    .replaceAll("{{CTA_COPY}}", meta.cta_copy || "Let’s talk about your first automation. The first call is free.");
  return out;
}

function cardHtml(meta, readMins) {
  const categories = [meta.category || "ai"].join(" ");
  const cover = meta.cover_image || "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format";
  const date = meta.date || new Date().toISOString().slice(0,10);
  const desc = meta.description || "";
  const title = meta.title || "Untitled Post";
  const href = `/posts/${meta.slug}/`;
  return `
<article class="post-card" data-category="${categories}">
  <div class="post-image">
    <img src="${cover}" alt="${title}" />
    <div class="post-category">${(meta.category || "AI").toUpperCase()}</div>
  </div>
  <div class="post-content">
    <div class="post-meta">
      <span class="date">${date}</span>
      <span class="read-time">${readMins} min read</span>
    </div>
    <h3>${title}</h3>
    <p>${desc}</p>
    <div class="post-footer">
      <a class="read-more" href="${href}">Read More</a>
      <div class="post-stats">
        <span><i class="fas fa-eye"></i> 0</span>
        <span><i class="fas fa-heart"></i> 0</span>
      </div>
    </div>
  </div>
</article>`;
}

function featuredHtml(meta, readMins) {
  const cover = meta.cover_image || "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format";
  const href = `/posts/${meta.slug}/`;
  return `
<a class="featured-card" href="${href}">
  <img src="${cover}" alt="${meta.title}" />
  <div class="featured-overlay">
    <div class="meta"><span>${meta.date}</span> • <span>${readMins} min</span></div>
    <h3>${meta.title}</h3>
    <p>${meta.description || ""}</p>
  </div>
</a>`;
}

function main() {
  ensureDir(OUT_DIR);

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const html = marked.parse(content);
    const readMins = readTime(content);
    const slug = (data.slug && String(data.slug)) || slugify(data.title || file.replace(/\.(md|mdx)$/,''));
    const meta = { ...data, slug };
    // write individual post page
    const outDir = path.join(OUT_DIR, slug);
    ensureDir(outDir);
    const outHtml = renderPost(meta, html, readMins);
    fs.writeFileSync(path.join(outDir, "index.html"), outHtml, "utf-8");
    return { meta, readMins };
  }).sort((a,b) => (a.meta.date || "").localeCompare(b.meta.date || "")).reverse();

  // Build blog listing
  const cards = posts.map(p => cardHtml(p.meta, p.readMins)).join("\n");
  const featured = posts.filter(p => p.meta.featured).slice(0,3).map(p => featuredHtml(p.meta, p.readMins)).join("\n");

  const listing = blogTemplate.replace("{{CARDS}}", cards).replace("{{FEATURED}}", featured);
  fs.writeFileSync(path.join(ROOT, "blog.html"), listing, "utf-8");

  // Also write a posts.json for potential future scripting
  const postsJson = posts.map(p => ({
    ...p.meta,
    read_mins: p.readMins,
    url: `/posts/${p.meta.slug}/`
  }));
  fs.writeFileSync(path.join(ROOT, "posts", "posts.json"), JSON.stringify(postsJson, null, 2), "utf-8");

  console.log(`Built ${posts.length} posts.`);
}

main();
