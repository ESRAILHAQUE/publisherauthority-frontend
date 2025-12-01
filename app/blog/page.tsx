import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/shared/Card";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "10 SEO Best Practices for Blog Content in 2025",
      excerpt:
        "Discover the latest SEO strategies that will help your blog content rank higher in search engine results.",
      category: "SEO",
      date: "January 15, 2025",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "How to Monetize Your Blog Without Annoying Ads",
      excerpt:
        "Learn about content marketing and sponsored content as effective alternatives to traditional advertising.",
      category: "Monetization",
      date: "January 10, 2025",
      readTime: "7 min read",
      featured: true,
    },
    {
      id: 3,
      title: "Building Domain Authority: A Complete Guide",
      excerpt:
        "Everything you need to know about Domain Authority and how to improve yours over time.",
      category: "SEO",
      date: "January 5, 2025",
      readTime: "10 min read",
      featured: false,
    },
    {
      id: 4,
      title: "Content Marketing vs Traditional Advertising",
      excerpt:
        "Compare the benefits of content marketing strategies versus traditional ad-based monetization.",
      category: "Marketing",
      date: "December 28, 2024",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 5,
      title: "Guest Posting: Best Practices for Publishers",
      excerpt:
        "Essential tips for publishers looking to maximize their earnings through quality guest posting.",
      category: "Publishing",
      date: "December 20, 2024",
      readTime: "8 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Understanding Organic Traffic Metrics",
      excerpt:
        "Learn how to track and analyze organic traffic to improve your blog performance.",
      category: "Analytics",
      date: "December 15, 2024",
      readTime: "5 min read",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "SEO",
    "Monetization",
    "Marketing",
    "Publishing",
    "Analytics",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3F207F] mb-4">
              Blog & Resources
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with the latest insights on SEO, digital marketing,
              and blog monetization.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white border-2 border-gray-300 text-gray-700 hover:border-[#3F207F] hover:text-[#3F207F] transition-colors font-medium">
                {category}
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {posts
              .filter((post) => post.featured)
              .map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
          </div>

          {/* Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {posts
              .filter((post) => !post.featured)
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#3F207F] text-white">
              1
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
}

function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link href={`/blog/${post.id}`}>
      <Card hover className="h-full">
        <div className="w-full h-48 bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {post.title.charAt(0)}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="purple" size="sm">
            {post.category}
          </Badge>
          <span className="text-sm text-gray-500">{post.date}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>
        <h3
          className={`font-bold text-gray-900 mb-2 ${
            featured ? "text-2xl" : "text-xl"
          }`}>
          {post.title}
        </h3>
        <p className="text-gray-600">{post.excerpt}</p>
        <div className="mt-4 text-[#3F207F] font-semibold hover:text-[#2EE6B7] transition-colors">
          Read More →
        </div>
      </Card>
    </Link>
  );
}
