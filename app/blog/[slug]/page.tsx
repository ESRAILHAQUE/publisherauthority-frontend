"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/shared/Badge";
import Link from "next/link";
import { blogApi, getApiUrl } from "@/lib/api";

interface BlogPost {
  _id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  author?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  status?: string;
  views?: number;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  [key: string]: unknown;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = (await blogApi.getPost(slug)) as {
        success?: boolean;
        data?: {
          post?: BlogPost;
          [key: string]: unknown;
        };
        post?: BlogPost;
        [key: string]: unknown;
      };

      const postData = response?.data?.post || response?.post;
      if (postData) {
        setPost(postData);
        // Load related posts
        if (postData.category?.slug) {
          loadRelatedPosts(
            postData.category.slug,
            postData._id || postData.slug
          );
        }
      }
    } catch (error) {
      console.error("Failed to load blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (categorySlug: string, excludeId?: string) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/blog/posts?category=${categorySlug}&limit=3`,
        {
          method: "GET",
        }
      );

      const data = (await response.json()) as {
        success?: boolean;
        data?: {
          posts?: BlogPost[];
          [key: string]: unknown;
        };
        posts?: BlogPost[];
        [key: string]: unknown;
      };

      const posts = data?.data?.posts || data?.posts || [];
      const filtered = posts
        .filter((p) => p._id !== excludeId && p.status === "published")
        .slice(0, 3);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error("Failed to load related posts:", error);
    }
  };

  const formatDate = (date?: string | Date): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content?: string): string => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-gray-600">Loading blog post...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Post Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The blog post you're looking for doesn't exist.
              </p>
              <Link
                href="/blog"
                className="text-primary-purple hover:text-[#2EE6B7] font-semibold">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-purple hover:text-[#2EE6B7] mb-6 transition-colors">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featuredImage}
                alt={post.title || "Blog post"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {post.category && (
                <Badge variant="purple" size="sm">
                  {post.category.name || "Uncategorized"}
                </Badge>
              )}
              {post.publishedAt && (
                <span className="text-gray-600">
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {calculateReadTime(post.content)}
              </span>
              {post.views !== undefined && post.views > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{post.views} views</span>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title || "Untitled"}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}

            {post.author && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-purple to-[#2EE6B7] flex items-center justify-center text-white font-bold">
                  {post.author.firstName?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author.firstName || ""} {post.author.lastName || ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="blog-content"
              />
            ) : (
              <p className="text-gray-600">No content available.</p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id || relatedPost.slug}
                    href={`/blog/${relatedPost.slug || relatedPost._id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full">
                      {relatedPost.featuredImage ? (
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title || "Blog post"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-primary-purple to-[#2EE6B7] rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {relatedPost.title?.charAt(0).toUpperCase() || "B"}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt ||
                          (relatedPost.content
                            ? relatedPost.content
                                .substring(0, 100)
                                .replace(/<[^>]*>/g, "") + "..."
                            : "")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
