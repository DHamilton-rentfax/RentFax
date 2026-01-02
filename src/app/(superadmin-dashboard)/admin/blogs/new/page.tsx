"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Loader2 } from "lucide-react";

import slugify from "@/utils/slugify";

import { uploadBlogImage, createBlogPost } from "@/lib/blog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function NewBlogPost() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("General");
  const [hero, setHero] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadBlogImage(file);
    setHero(url);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);

    await createBlogPost({
      title,
      subtitle,
      slug: slugify(slug || title),
      content,
      tags: tags.split(",").map((t) => t.trim()),
      category,
      heroImage: hero,
      published: false,
    });

    setSaving(false);
    alert("Saved!");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      <h1 className="text-3xl font-bold">Create Blog Post</h1>

      <Card className="p-6 space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
        />

        <Textarea
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {uploading && (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" /> Uploading...
          </p>
        )}

        {hero && <img src={hero} className="rounded-lg max-h-64" />}

        <ReactQuill value={content} onChange={setContent} />

        <Button disabled={saving} onClick={save}>
          {saving ? "Saving..." : "Save Draft"}
        </Button>
      </Card>
    </div>
  );
}
