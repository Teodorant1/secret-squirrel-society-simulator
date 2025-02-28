/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  label: string;
}

export function ImageUpload({ label }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {image && (
          <img
            src={image || "/placeholder.svg"}
            alt="Uploaded"
            className="h-16 w-16 rounded object-cover"
          />
        )}
        <Button variant="outline" className="w-full" asChild>
          <label className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
