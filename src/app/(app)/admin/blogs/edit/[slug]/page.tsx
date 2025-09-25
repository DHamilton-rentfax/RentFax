"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import { Skeleton } from "@/components/ui/skeleton";

const Editor = dynamic(() => import("@/components/BlogEditor"), { ssr: false });

export default function EditBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setExcerpt(data.excerpt || "");
          setBody(data.body || "");
          setImage(data.image || null);
          setPublished(data.published || false);
        } else {
            toast({ title: "Not Found", description: "This blog post could not be found.", variant: "destructive" });
            router.push("/admin/blogs");
        }
      } catch (e: any) {
        toast({ title: "Error Loading Post", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug, router, toast]);

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
        const docRef = doc(db, "blogs", slug);
        await setDoc(docRef, {
            title,
            excerpt,
            body,
            image,
            published,
            // Keep original date, update 'read' time
            read: `${Math.ceil(body.split(" ").length / 200)} min read`,
        }, { merge: true });
        toast({ title: "Post Updated", description: "Your changes have been saved." });
        router.push("/admin/blogs");
    } catch(e: any) {
        toast({ title: "Save Failed", description: e.message, variant: "destructive" });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="mx-auto max-w-4xl space-y-6 p-4">
            <Skeleton className="h-8 w-1/4" />
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold font-headline">Edit Blog Post</h1>

        <Card>
            <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>Make changes to your blog post below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-1" rows={2} />
                </div>
                <div>
                    <Label htmlFor="cover-image">Cover Image</Label>
                    <Input id="cover-image" type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="mt-1" />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading…</p>}
                    {image && <img src={image} alt="cover" className="mt-3 rounded-lg max-h-48 border" />}
                </div>
                <div>
                    <Label>Content</Label>
                    <Editor value={body} onChange={setBody} />
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <Switch id="published" checked={published} onCheckedChange={setPublished} />
                    <Label htmlFor="published" className="text-base">
                        {published ? "Published" : "Draft Mode"}
                    </Label>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={savePost} disabled={saving || uploading}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </div>
    </Protected>
  );
}
