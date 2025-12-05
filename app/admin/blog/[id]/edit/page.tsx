"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Select } from "@/components/shared/Select";
import { Loader } from "@/components/shared/Loader";
import { blogApi, adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  _id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string | { _id?: string; name?: string; slug?: string };
  featuredImage?: string;
  status?: string;
  [key: string]: unknown;
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    featuredImage: "",
    status: "draft",
  });

  useEffect(() => {
    if (postId) {
      loadCategories();
      loadPost();
    }
  }, [postId]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
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
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = (await blogApi.getBlogPostById(postId)) as {
        success?: boolean;
        data?: {
          post?: BlogPost;
          [key: string]: unknown;
        };
        post?: BlogPost;
        [key: string]: unknown;
      };

      const post = response?.data?.post || response?.post;
      if (post) {
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          category:
            typeof post.category === "object" && post.category?.slug
              ? post.category.slug
              : typeof post.category === "string"
              ? post.category
              : "",
          featuredImage: post.featuredImage || "",
          status: post.status || "draft",
        });
      }
    } catch (error) {
      console.error("Failed to load blog post:", error);
      toast.error("Failed to load blog post");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await blogApi.updatePost(postId, formData);
      toast.success("Blog post updated successfully!");
      router.push("/admin/blog");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update blog post";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading blog post..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Edit Blog Post
        </h1>
        <p className="text-gray-600">Update your blog post content.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Post Title"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData({
                ...formData,
                title,
                slug: title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
              });
            }}
            placeholder="e.g., SEO Best Practices for 2025"
            required
          />

          <Input
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="seo-best-practices-2025"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              options={[
                {
                  value: "",
                  label: loadingCategories ? "Loading..." : "Select category",
                },
                ...categories.map((cat) => ({
                  value: cat.slug,
                  label: cat.name,
                })),
              ]}
              disabled={loadingCategories}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </div>

          <Input
            label="Featured Image URL"
            type="url"
            value={formData.featuredImage}
            onChange={(e) =>
              setFormData({ ...formData, featuredImage: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />

          <Textarea
            label="Excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            rows={3}
            placeholder="Short description of the post..."
          />

          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={15}
            placeholder="Write your blog post content here..."
            required
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blog")}
              disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saving} disabled={saving}>
              Update Post
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
