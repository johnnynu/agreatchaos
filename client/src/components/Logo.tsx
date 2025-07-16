"use client";

import { useState } from "react";

interface LogoProps {
  variant?: "header" | "sidebar" | "footer";
  className?: string;
}

export function Logo({ variant = "header", className = "" }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Simple placeholder component
  const LogoPlaceholder = ({ size }: { size: number }) => (
    <div
      className="bg-gradient-to-br from-blue-600 to-stone-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: size * 0.4 }}>F</span>
    </div>
  );

  if (variant === "header") {
    return (
      <a href="/" className={`flex items-center relative z-10 ${className}`}>
        <div
          className="relative"
          style={{
            height: "180px",
            width: "180px",
            marginTop: "-20px",
            marginBottom: "-80px",
          }}
        >
          {!imageError ? (
            <img
              src="/fudgebox-logo.png"
              alt="FudgeBox"
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <LogoPlaceholder size={140} />
          )}
        </div>
      </a>
    );
  }

  if (variant === "sidebar") {
    return (
      <a href="/" className={`flex items-center relative z-10 ${className}`}>
        <div
          className="relative"
          style={{
            height: "120px",
            width: "120px",
            marginTop: "-20px",
            marginBottom: "-45px",
          }}
        >
          {!imageError ? (
            <img
              src="/fudgebox-logo.png"
              alt="FudgeBox"
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <LogoPlaceholder size={90} />
          )}
        </div>
      </a>
    );
  }

  // Footer variant
  return (
    <a href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        {!imageError ? (
          <img
            src="/fudgebox-logo.png"
            alt="FudgeBox"
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <LogoPlaceholder size={32} />
        )}
      </div>
    </a>
  );
}
