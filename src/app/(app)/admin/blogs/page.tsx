"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import Protected from "@/components/protected";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
        console.error("Error fetching blogs: ", error);
        toast({ title: "Error", description: "Could not fetch blog posts.", variant: "destructive"});
        setLoading(false);
    });
    return () => unsub();
  }, [toast]);

  const deleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      await deleteDoc(doc(db, "blogs", id));
      toast({ title: "Post Deleted", description: "The blog post has been permanently removed."});
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    await updateDoc(doc(db, "blogs", id), { published: !published });
    toast({ title: `Post ${!published ? 'Published' : 'Unpublished'}` });
  };

  return (
    <Protected roles={['owner', 'manager']}>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-headline">Blog Dashboard</h1>
                <Button asChild>
                    <Link href="/admin/blogs/new">
                    + New Post
                    </Link>
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Manage Posts</CardTitle>
                    <CardDescription>Create, edit, and manage all blog posts for your public website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {loading ? (
                                Array.from({length: 3}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : blogs.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center">No blog posts found.</TableCell></TableRow>
                            ) : (
                                blogs.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">{b.title}</TableCell>
                                    <TableCell>{b.date}</TableCell>
                                    <TableCell>
                                        {b.published ? (
                                            <Badge variant="default">Published</Badge>
                                        ) : (
                                            <Badge variant="secondary">Draft</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                 <Button variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                 <DropdownMenuItem asChild>
                                                    <Link href={`/admin/blogs/edit/${b.id}`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => togglePublish(b.id, b.published)}>
                                                    {b.published ? "Unpublish" : "Publish"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteBlog(b.id)} className="text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </Protected>
  );
}
