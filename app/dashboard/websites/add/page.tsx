"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Card } from "@/components/shared/Card";
import { websitesApi } from "@/lib/api";
import toast from "react-hot-toast";
import { websiteNiches } from "@/lib/niches";
import { Select } from "@/components/shared/Select";

export default function AddWebsitePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");
  const [formData, setFormData] = useState({
    url: "",
    domainAuthority: "",
    monthlyTraffic: "",
    niche: "",
    description: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  const handleBulkUpload = async () => {
    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    setIsUploadingBulk(true);
    setError("");
    setSuccess(false);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file must contain at least a header row and one data row");
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const websites = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const website: Record<string, unknown> = {};
        headers.forEach((header, idx) => {
          const value = values[idx] || '';
          if (header === 'domainauthority' || header === 'da') {
            website.domainAuthority = parseInt(value) || 0;
          } else if (header === 'monthlytraffic' || header === 'traffic') {
            website.monthlyTraffic = parseInt(value) || 0;
          } else if (header === 'price') {
            website.price = parseFloat(value) || 0;
          } else if (header === 'url' || header === 'website' || header === 'domain') {
            website.url = value;
          } else if (header === 'niche' || header === 'category') {
            website.niche = value;
          } else if (header === 'description' || header === 'desc') {
            website.description = value;
          } else {
            website[header] = value;
          }
        });
        return website;
      }).filter(w => w.url && (w.url as string).trim() !== '');

      if (websites.length === 0) {
        throw new Error("No valid websites found in CSV file. Please check the format.");
      }

      await websitesApi.bulkAddWebsites(websites as any);
      setSuccess(true);
      toast.success(`${websites.length} websites uploaded successfully!`);
      setCsvFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        router.push("/dashboard/websites");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload websites. Please check CSV format.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await websitesApi.addWebsite({
        url: formData.url,
        domainAuthority: parseInt(formData.domainAuthority),
        monthlyTraffic: parseInt(formData.monthlyTraffic),
        niche: formData.niche,
        description: formData.description,
        price: parseFloat(formData.price),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/websites");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit website. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Add Website
        </h1>
        <p className="text-gray-600">
          Submit your website for review and approval.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("individual")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "individual"
                ? "border-primary-purple text-primary-purple"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Individual
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "bulk"
                ? "border-green-600 text-gray-900 px-4"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Bulk
          </button>
        </nav>
      </div>

      {/* Individual Tab Content */}
      {activeTab === "individual" && (
      <Card>
        <div className="prose max-w-none mb-8 text-gray-700 space-y-4">
          <p>
            <strong>
              Do you own one or several websites with impressive stats and
              healthy traffic?
            </strong>{" "}
            Looking to monetize them effortlessly? We can help you turn those
            metrics into cash.
          </p>
          <p>
            <strong>Here&apos;s how it works:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We write the content.</li>
            <li>You post it.</li>
            <li>You earn money.</li>
          </ul>
          <p>
            If your sites meet our criteria, we&apos;d love to consider them for
            our portfolio. However, we are selective about the sites we
            collaborate with.{" "}
            <strong>Here&apos;s what we&apos;re looking for:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Links must be dofollow and easily identifiable within the article.
            </li>
            <li>
              Strong metrics: a minimum of 1,000 organic visitors per month
              according to Ahrefs.
            </li>
            <li>
              Strict adherence to white-hat SEO practices. No black-hat tactics
              allowed.
            </li>
            <li>
              Predominantly informational content; no clear-cut affiliate sites.
            </li>
            <li>A clean history—no penalties.</li>
            <li>
              No labels such as &quot;sponsored,&quot; &quot;guest post,&quot;
              or &quot;guest author&quot; on the post.
            </li>
            <li>
              Your site&apos;s header, footer, or sidebar must be free from
              phrases like &quot;write for us,&quot; &quot;guest post,&quot; or
              anything similar, and not contain spammy links like casino,
              essays, adult sites, etc.
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
              onChange={(e) =>
                setFormData({ ...formData, domainAuthority: e.target.value })
              }
              placeholder="20"
              min="20"
              required
            />
            <Input
              label="Monthly Organic Traffic (Ahrefs)"
              name="monthlyTraffic"
              type="number"
              value={formData.monthlyTraffic}
              onChange={(e) =>
                setFormData({ ...formData, monthlyTraffic: e.target.value })
              }
              placeholder="1000"
              min="1000"
              required
            />
          </div>

          <Select
            label="All Website Niche/Category show and user select"
            name="niche"
            value={formData.niche}
            onChange={(e) =>
              setFormData({ ...formData, niche: e.target.value })
            }
            options={websiteNiches}
            required
          />

          <Input
            label="Price per Article ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="100.00"
            min="0"
            step="0.01"
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Brief description of your website..."
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/websites")}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}>
              Submit for Review
            </Button>
          </div>
        </form>
      </Card>
      )}

      {/* Bulk Tab Content */}
      {activeTab === "bulk" && (
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Upload a CSV File to Add or Edit Your Domains
        </h2>

        <div className="space-y-6">
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              To start, please make a copy of the template file that has been published on Google Sheets. 
              Once you have your own copy, proceed to add your domains along with their corresponding values into the file. 
              After ensuring that all your domains and values are correctly entered, export the file in CSV format. 
              Lastly, you can upload the exported CSV file here.
            </p>
          </div>

          <div className="mb-6">
            <a
              href="https://docs.google.com/spreadsheets/d/1YOUR_TEMPLATE_ID/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Make a copy of the template file (Google Sheets)
            </a>
          </div>

          {error && activeTab === "bulk" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && activeTab === "bulk" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Websites uploaded successfully! Redirecting...
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV file
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCsvFile(file);
                    setError("");
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-300 rounded-lg p-2"
              />
              {csvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-medium">{csvFile.name}</span>
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleBulkUpload}
                isLoading={isUploadingBulk}
                disabled={isUploadingBulk || !csvFile}
                className="bg-green-600 hover:bg-green-700 text-white">
                Submit CSV file
              </Button>
            </div>
          </div>
        </div>
      </Card>
      )}

    </div>
  );
}
