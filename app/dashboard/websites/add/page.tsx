'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Card } from '@/components/shared/Card';
import { websitesApi } from '@/lib/api';

export default function AddWebsitePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    url: '',
    domainAuthority: '',
    monthlyTraffic: '',
    niche: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await websitesApi.addWebsite({
        url: formData.url,
        domainAuthority: parseInt(formData.domainAuthority),
        monthlyTraffic: parseInt(formData.monthlyTraffic),
        niche: formData.niche,
        description: formData.description,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/websites');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit website. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Add Website</h1>
        <p className="text-gray-600">Submit your website for review and approval.</p>
      </div>

      <Card>
        <div className="prose max-w-none mb-8 text-gray-700 space-y-4">
          <p>
            <strong>Do you own one or several websites with impressive stats and healthy traffic?</strong> Looking 
            to monetize them effortlessly? We can help you turn those metrics into cash.
          </p>
          <p><strong>Here&apos;s how it works:</strong></p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We write the content.</li>
            <li>You post it.</li>
            <li>You earn money.</li>
          </ul>
          <p>
            If your sites meet our criteria, we&apos;d love to consider them for our portfolio. However, we are 
            selective about the sites we collaborate with. <strong>Here&apos;s what we&apos;re looking for:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Links must be dofollow and easily identifiable within the article.</li>
            <li>Strong metrics: a minimum of 1,000 organic visitors per month according to Ahrefs.</li>
            <li>Strict adherence to white-hat SEO practices. No black-hat tactics allowed.</li>
            <li>Predominantly informational content; no clear-cut affiliate sites.</li>
            <li>A clean history—no penalties.</li>
            <li>No labels such as &quot;sponsored,&quot; &quot;guest post,&quot; or &quot;guest author&quot; on the post.</li>
            <li>
              Your site&apos;s header, footer, or sidebar must be free from phrases like &quot;write for us,&quot; 
              &quot;guest post,&quot; or anything similar, and not contain spammy links like casino, essays, adult sites, etc.
            </li>
          </ul>
          <p>Fill out the form below with your domains for our review.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Website submitted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Website URL"
            name="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Domain Authority (DA)"
              name="domainAuthority"
              type="number"
              value={formData.domainAuthority}
              onChange={(e) => setFormData({ ...formData, domainAuthority: e.target.value })}
              placeholder="20"
              min="20"
              required
            />
            <Input
              label="Monthly Organic Traffic (Ahrefs)"
              name="monthlyTraffic"
              type="number"
              value={formData.monthlyTraffic}
              onChange={(e) => setFormData({ ...formData, monthlyTraffic: e.target.value })}
              placeholder="1000"
              min="1000"
              required
            />
          </div>

          <Input
            label="Website Niche/Category"
            name="niche"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            placeholder="Technology, Health, Finance, etc."
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Brief description of your website..."
          />

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/dashboard/websites')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Submit for Review
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-4">Bulk Add Websites</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file to add multiple websites at once. Download the template below.
        </p>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
            Download CSV Template
          </button>
          <input
            type="file"
            accept=".csv"
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3F207F] file:text-white hover:file:bg-[#5A2F9F] cursor-pointer"
          />
        </div>
      </Card>
    </div>
  );
}

