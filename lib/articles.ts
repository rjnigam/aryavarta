import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleMetadata {
  title: string;
  slug: string;
  source: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
}

export interface Article extends ArticleMetadata {
  content: string;
}

/**
 * Get all article slugs
 */
export function getAllArticleSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading articles directory:', error);
    return [];
  }
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...(data as Omit<ArticleMetadata, 'slug'>),
      slug,
      content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * Get all articles with metadata (sorted by date, newest first)
 */
export function getAllArticles(): ArticleMetadata[] {
  const slugs = getAllArticleSlugs();
  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;
      
      // Return only metadata, not content
      const { content, ...metadata } = article;
      return metadata;
    })
    .filter((article): article is ArticleMetadata => article !== null)
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return articles;
}

/**
 * Get recent articles (limit by count)
 */
export function getRecentArticles(limit: number = 10): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.slice(0, limit);
}

/**
 * Search articles by tag
 */
export function getArticlesByTag(tag: string): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search articles by source
 */
export function getArticlesBySource(source: string): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.filter(
    (article) => article.source.toLowerCase() === source.toLowerCase()
  );
}
