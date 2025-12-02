'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Select } from '@/components/shared/Select';
import { blogApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    featuredImage: '',
    status: 'draft',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await blogApi.createPost(formData);
      toast.success('Blog post created successfully!');
      router.push('/admin/blog');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create blog post';
      toast.error(errorMessage);
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">Create a new blog post for the website.</p>
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
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: '', label: 'Select category' },
                { value: 'seo', label: 'SEO' },
                { value: 'digital-marketing', label: 'Digital Marketing' },
                { value: 'content-marketing', label: 'Content Marketing' },
                { value: 'social-media', label: 'Social Media' },
                { value: 'web-design', label: 'Web Design' },
              ]}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ]}
            />
          </div>

          <Input
            label="Featured Image URL"
            type="url"
            value={formData.featuredImage}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          <Textarea
            label="Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            placeholder="Short description of the post..."
          />

          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            placeholder="Write your blog post content here..."
            required
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/blog')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} disabled={loading}>
              Create Post
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

