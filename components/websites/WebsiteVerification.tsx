"use client";

import React, { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";

interface WebsiteVerificationProps {
  website: {
    _id: string;
    url: string;
    verificationCode: string;
    status: string;
    verificationMethod?: "tag" | "article";
  };
  onVerify: (method: "tag" | "article") => Promise<void>;
}

export function WebsiteVerification({
  website,
  onVerify,
}: WebsiteVerificationProps) {
  const [verifying, setVerifying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "tag" | "article" | null
  >(null);

  const handleVerify = async (method: "tag" | "article") => {
    setVerifying(true);
    try {
      await onVerify(method);
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
              <h4 className="font-semibold text-gray-900 mb-2">
                Method 2: Verification Article
              </h4>
              <p className="text-sm text-gray-600">
                Publish a temporary verification article with a specific link
              </p>
            </div>
            {selectedMethod === "article" && (
              <Badge variant="success">Selected</Badge>
            )}
          </div>

          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Verification Link:</strong>
            </p>
            <a
              href={`${website.url}/publisherauthority-verification-${website.verificationCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-purple hover:underline break-all">
              {website.url}/publisherauthority-verification-
              {website.verificationCode}
            </a>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
            <li>Create a new article on your website</li>
            <li>Include the verification link above in the article content</li>
            <li>Publish the article (it can be temporary)</li>
            <li>Click &quot;Verify via Article&quot; below</li>
          </ol>

          <Button
            variant="outline"
            onClick={() => handleVerify("article")}
            disabled={verifying || selectedMethod !== null}
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
