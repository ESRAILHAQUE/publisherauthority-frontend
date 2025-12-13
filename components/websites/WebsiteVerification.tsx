"use client";

import React, { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Input } from "@/components/shared/Input";

interface WebsiteVerificationProps {
  website: {
    _id: string;
    url: string;
    verificationCode: string;
    status: string;
    verificationMethod?: "tag" | "article";
  };
  onVerify: (method: "tag" | "article", articleUrl?: string) => Promise<void>;
}

export function WebsiteVerification({
  website,
  onVerify,
}: WebsiteVerificationProps) {
  const [verifying, setVerifying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "tag" | "article" | null
  >(null);
  const [articleUrl, setArticleUrl] = useState("");

  const handleVerify = async (method: "tag" | "article") => {
    if (method === "article" && !articleUrl.trim()) {
      alert("Please enter the article URL containing the anchor link");
      return;
    }

    setVerifying(true);
    try {
      await onVerify(method, method === "article" ? articleUrl.trim() : undefined);
      setSelectedMethod(method);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setVerifying(false);
    }
  };

  if (website.status === "active") {
    return (
      <Card>
        <div className="flex items-center space-x-3">
          <Badge variant="success">Verified</Badge>
          <span className="text-gray-600">
            Verified via{" "}
            {website.verificationMethod === "tag"
              ? "HTML Tag"
              : "Verification Article"}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-primary-purple mb-4">
        Website Verification
      </h3>
      <p className="text-gray-600 mb-6">
        To verify ownership of <strong>{website.url}</strong>, choose one of the
        following methods:
      </p>

      <div className="space-y-6">
        {/* Method 1: HTML Tag */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Method 1: HTML Tag Verification
              </h4>
              <p className="text-sm text-gray-600">
                Add a verification tag to your website&apos;s HTML &lt;head&gt;
                section
              </p>
            </div>
            {selectedMethod === "tag" && (
              <Badge variant="success">Selected</Badge>
            )}
          </div>

          <div className="bg-gray-50 rounded p-4 mb-4 font-mono text-sm">
            <code>
              {`<meta name="publisherauthority-verification" content="${website.verificationCode}" />`}
            </code>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
            <li>Copy the verification code above</li>
            <li>Add it to your website&apos;s HTML &lt;head&gt; section</li>
            <li>Save and publish the changes</li>
            <li>Click &quot;Verify via HTML Tag&quot; below</li>
          </ol>

          <Button
            variant="outline"
            onClick={() => handleVerify("tag")}
            disabled={verifying || selectedMethod !== null}
            isLoading={verifying && selectedMethod === null}>
            Verify via HTML Tag
          </Button>
        </div>

        {/* Method 2: Verification Article */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">
                  Method 2: Verification Article
                </h4>
                <Badge variant="info">Recommended</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Publish the specified content with a required anchor link.
              </p>
            </div>
            {selectedMethod === "article" && (
              <Badge variant="success">Selected</Badge>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Instructions:</strong>
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Place the text below — with the required anchor text and link — in the body of an article on your site.
            </p>

            <div className="bg-gray-50 rounded p-4 mb-3 space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Anchor text: <span className="font-normal">Publisher Authority</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Link: <a href="https://publisherauthority.com" target="_blank" rel="noopener noreferrer" className="text-primary-purple hover:underline font-normal">https://publisherauthority.com</a>
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Make sure the text is not placed in a comment section, profile description, footer, or any secondary area.
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              The article URL containing the anchor link can be temporary.
            </p>

            <div className="mt-4">
              <Input
                label="Article URL containing the anchor link:"
                type="url"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                placeholder="https://example.com/article-url"
                disabled={verifying || selectedMethod !== null}
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => handleVerify("article")}
            disabled={verifying || selectedMethod !== null || !articleUrl.trim()}
            isLoading={verifying && selectedMethod === null}>
            Verify via Article
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> After verification, our system will
          automatically check your website. This process may take a few minutes.
          You&apos;ll be notified once verification is complete.
        </p>
      </div>
    </Card>
  );
}
