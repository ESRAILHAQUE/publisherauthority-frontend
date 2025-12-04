"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { blogApi } from "@/lib/api";
import toast from "react-hot-toast";

interface BlogPost {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  status?: string;
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
  views?: number;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = (await blogApi.getAdminPosts()) as {
        success?: boolean;
        data?: {
          posts?: BlogPost[];
          [key: string]: unknown;
        };
        posts?: BlogPost[];
        [key: string]: unknown;
      };

      const postsData = response?.data?.posts || response?.posts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await blogApi.deletePost(postId);
      toast.success("Post deleted successfully");
      await loadPosts();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete post";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            Blog Management
          </h1>
          <p className="text-gray-600">Create and manage blog posts.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/blog/create")}>
          Create New Post
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Author
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Views
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    No blog posts found.{" "}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/admin/blog/create")}>
                      Create your first post
                    </Button>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post._id || post.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {post.title || "Untitled"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {post.category?.name || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {post.author
                        ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() || "-"
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          post.status === "published" ? "success" : "default"
                        }>
                        {post.status
                          ? post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)
                          : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {post.views || 0}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {post.createdAt
                        ? new Date(
                            post.createdAt as string | Date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/blog/${post._id || post.id}/edit`
                            )
                          }>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const postId = post._id || post.id;
                            if (postId) handleDelete(postId);
                          }}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
