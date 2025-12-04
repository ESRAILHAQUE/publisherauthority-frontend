"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import Link from "next/link";
import { blogApi, getApiUrl } from "@/lib/api";

interface BlogPost {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
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
  [key: string]: unknown;
}

interface Category {
  _id?: string;
  name?: string;
  slug?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, [selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const response = (await blogApi.getCategories()) as {
        success?: boolean;
        data?: {
          categories?: Category[];
          [key: string]: unknown;
        };
        categories?: Category[];
        [key: string]: unknown;
      };

      const categoriesData =
        response?.data?.categories || response?.categories || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      params.append("page", String(currentPage));
      params.append("limit", "12");
      const query = params.toString() ? `?${params.toString()}` : "";

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/blog/posts${query}`, {
        method: "GET",
      });

      const data = (await response.json()) as {
        success?: boolean;
        data?: {
          posts?: BlogPost[];
          total?: number;
          page?: number;
          pages?: number;
          [key: string]: unknown;
        };
        posts?: BlogPost[];
        total?: number;
        page?: number;
        pages?: number;
        [key: string]: unknown;
      };

      const postsData = data?.data?.posts || data?.posts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
      setTotalPages(data?.data?.pages || data?.pages || 1);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content?: string): string => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (date?: string | Date): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get featured posts (first 2 published posts)
  const featuredPosts = posts.filter((post) => post.status === "published").slice(0, 2);
  const otherPosts = posts.filter((post) => post.status === "published").slice(2);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-gray-600">Loading blog posts...</div>
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-purple mb-4">
              Blog & Resources
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with the latest insights on SEO, digital marketing,
              and blog monetization.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full border-2 transition-colors font-medium ${
                selectedCategory === "all"
                  ? "bg-primary-purple text-white border-primary-purple"
                  : "bg-white border-gray-300 text-gray-700 hover:border-primary-purple hover:text-primary-purple"
              }`}>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id || category.slug}
                onClick={() => {
                  setSelectedCategory(category.slug || "");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full border-2 transition-colors font-medium ${
                  selectedCategory === category.slug
                    ? "bg-primary-purple text-white border-primary-purple"
                    : "bg-white border-gray-300 text-gray-700 hover:border-primary-purple hover:text-primary-purple"
                }`}>
                {category.name}
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post._id || post.id}
                  post={post}
                  featured
                  calculateReadTime={calculateReadTime}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* Other Posts */}
          {otherPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {otherPosts.map((post) => (
                <BlogCard
                  key={post._id || post.id}
                  post={post}
                  calculateReadTime={calculateReadTime}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* No Posts Message */}
          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No blog posts found.
              </p>
              <p className="text-gray-500">
                Check back later for new content!
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-primary-purple text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}>
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  calculateReadTime: (content?: string) => string;
  formatDate: (date?: string | Date) => string;
}

function BlogCard({ post, featured = false, calculateReadTime, formatDate }: BlogCardProps) {
  const imageUrl = post.featuredImage || "";
  const hasImage = imageUrl && imageUrl.trim() !== "";

  return (
    <Link href={`/blog/${post.slug || post._id || post.id}`}>
      <Card hover className="h-full">
        {hasImage ? (
          <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
            <img
              src={imageUrl}
              alt={post.title || "Blog post"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-purple to-[#2EE6B7] rounded-lg mb-4 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {post.title?.charAt(0).toUpperCase() || "B"}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.category && (
            <Badge variant="purple" size="sm">
              {post.category.name || "Uncategorized"}
            </Badge>
          )}
          {post.publishedAt && (
            <>
              <span className="text-sm text-gray-500">
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-sm text-gray-500">•</span>
            </>
          )}
          <span className="text-sm text-gray-500">
            {calculateReadTime(post.content)}
          </span>
          {post.views !== undefined && post.views > 0 && (
            <>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.views} views</span>
            </>
          )}
        </div>
        <h3
          className={`font-bold text-gray-900 mb-2 ${
            featured ? "text-2xl" : "text-xl"
          }`}>
          {post.title || "Untitled"}
        </h3>
        <p className="text-gray-600">
          {post.excerpt ||
            (post.content
              ? post.content.substring(0, 150).replace(/<[^>]*>/g, "") + "..."
              : "No excerpt available")}
        </p>
        <div className="mt-4 text-primary-purple font-semibold hover:text-[#2EE6B7] transition-colors">
          Read More →
        </div>
      </Card>
    </Link>
  );
}
