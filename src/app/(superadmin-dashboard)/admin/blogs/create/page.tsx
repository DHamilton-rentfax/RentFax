"use client";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// A mock rich text editor component. In a real app, this would be a library like Tiptap or BlockNote.
const RichTextEditor = ({ value, onChange }) => (
    <div className="border rounded-md p-4 bg-white h-96 overflow-y-auto">
        <textarea 
            className="w-full h-full resize-none border-0 focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your masterpiece..."
        />
    </div>
);

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  const handleSave = () => {
    // Here you would call a function to save the post to your database
    console.log({ title, content, status });
    alert("Post saved! (Check the console for the data)");
  };

  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <div>
            <Button variant="outline" className="mr-2" onClick={() => setStatus('draft')}>Save as Draft</Button>
            <Button variant="success" onClick={() => setStatus('published')}>Publish Post</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Input 
                    placeholder="Enter your blog post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold h-14"
                />
                <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p><strong>Status:</strong> <span className="capitalize">{status}</span></p>
                        <p className="text-sm text-gray-500">Set the status by clicking the save or publish buttons.</p>
                        <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="SEO Title..." />
                        <textarea className="w-full border rounded-md p-2" rows="4" placeholder="SEO Description..."></textarea>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
