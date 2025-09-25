"use client";

import { useState } from "react";
import { db } from "@/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Protected from "@/components/protected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Editor = dynamic(() => import("@/components/BlogEditor"), { ssr: false });

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `blog-images/${file.name}-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImage(url);
    } catch(e: any) {
        toast({ title: "Image Upload Failed", description: e.message, variant: "destructive" });
    } finally {
        setUploading(false);
    }
  };

  const savePost = async () => {
    if (!title.trim()) {
        toast({ title: "Title is required", variant: "destructive" });
        return;
    }
    setSaving(true);
    try {
        const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, '');
        const docRef = doc(db, "blogs", slug);
        await setDoc(docRef, {
            title,
            excerpt,
            body,
            image,
            date: new Date().toDateString(),
            read: `${Math.ceil(body.split(" ").length / 200)} min read`,
            published,
            author: "Admin", // TODO: use logged-in user from useAuth
        });
        toast({ title: "Post Saved", description: "Your new blog post has been created." });
        router.push("/admin/blogs");
    } catch(e: any) {
        toast({ title: "Save Failed", description: e.message, variant: "destructive" });
        setSaving(false);
    }
  };

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold font-headline">New Blog Post</h1>

        <Card>
            <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>Fill in the details for your new blog post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="mt-1"
                        rows={2}
                    />
                </div>
                <div>
                    <Label htmlFor="cover-image">Cover Image</Label>
                    <Input
                        id="cover-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                        className="mt-1"
                    />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading…</p>}
                    {image && <img src={image} alt="cover" className="mt-3 rounded-lg max-h-48 border" />}
                </div>
                <div>
                    <Label>Content</Label>
                    <Editor value={body} onChange={setBody} />
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <Switch
                        id="published"
                        checked={published}
                        onCheckedChange={setPublished}
                    />
                    <Label htmlFor="published" className="text-base">Publish Post</Label>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button
                onClick={savePost}
                disabled={saving || uploading}
            >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Post
            </Button>
        </div>
      </div>
    </Protected>
  );
}
