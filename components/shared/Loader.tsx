import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  fullScreen = false,
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const spinnerSizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const LoaderContent = () => {
    // Create 20 segments for the spinner
    const segments = 20;
    const segmentAngle = 360 / segments;
    const outerRadius = 30;
    const innerRadius = 24;

    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        {/* Segmented Circular Spinner */}
        <div
          className="relative"
          style={{ width: sizeClasses[size], height: sizeClasses[size] }}>
          <svg
            className="animate-spin"
            style={{
              width: "100%",
              height: "100%",
              animation: "spin 1s linear infinite",
            }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: segments }).map((_, index) => {
              const angle = (index * segmentAngle - 90) * (Math.PI / 180); // Start from top
              const segmentWidth = ((segmentAngle * Math.PI) / 180) * 0.7; // 70% of segment angle
              const startAngle = angle - segmentWidth / 2;
              const endAngle = angle + segmentWidth / 2;

              // Outer arc points
              const x1 = 50 + outerRadius * Math.cos(startAngle);
              const y1 = 50 + outerRadius * Math.sin(startAngle);
              const x2 = 50 + outerRadius * Math.cos(endAngle);
              const y2 = 50 + outerRadius * Math.sin(endAngle);

              // Inner arc points
              const x3 = 50 + innerRadius * Math.cos(endAngle);
              const y3 = 50 + innerRadius * Math.sin(endAngle);
              const x4 = 50 + innerRadius * Math.cos(startAngle);
              const y4 = 50 + innerRadius * Math.sin(startAngle);

              // Calculate opacity for wave effect
              const opacity =
                0.15 +
                (Math.sin(
                  (index / segments) * Math.PI * 2 + Date.now() / 1000
                ) *
                  0.5 +
                  0.5) *
                  0.85;

              return (
                <path
                  key={index}
                  d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill="#2EE6B7"
                  opacity={opacity}
                  style={{
                    animation: `segmentFade 1.5s ease-in-out infinite`,
                    animationDelay: `${index * 0.075}s`,
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Loading Text */}
        {text && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">{text}</span>
            <div className="flex gap-1">
              <span
                className="w-1 h-1 bg-[#2EE6B7] rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1 h-1 bg-[#2EE6B7] rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1 h-1 bg-[#2EE6B7] rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

// Skeleton Loader for Content Placeholders
export const SkeletonLoader: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 3, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Image Skeleton */}
          <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4" />

          {/* Content Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
            </div>
            <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
            <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Blog Post Skeleton Loader
export const BlogPostSkeleton: React.FC<{
  count?: number;
  featured?: boolean;
}> = ({ count = 3, featured = false }) => {
  return (
    <div
      className={
        featured
          ? "grid grid-cols-1 md:grid-cols-2 gap-8"
          : "grid grid-cols-1 md:grid-cols-3 gap-6"
      }>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full h-48 bg-gradient-to-r from-[#3F207F]/20 via-[#2EE6B7]/20 to-[#3F207F]/20" />

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
            </div>
            <div
              className={`h-6 ${
                featured ? "w-3/4" : "w-full"
              } bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded`}
            />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
            </div>
            <div className="h-4 w-24 bg-gradient-to-r from-[#3F207F]/30 via-[#2EE6B7]/30 to-[#3F207F]/30 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
