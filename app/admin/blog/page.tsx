'use client';

import React from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

export default function AdminBlogPage() {
  const posts = [
    { id: 1, title: 'SEO Best Practices', status: 'Published', date: '2025-01-15' },
    { id: 2, title: 'Content Marketing Tips', status: 'Draft', date: '2025-01-10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts.</p>
        </div>
        <Button variant="primary">Create New Post</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{post.title}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{post.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

