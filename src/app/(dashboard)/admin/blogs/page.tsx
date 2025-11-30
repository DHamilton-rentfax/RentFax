"use client";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mock data for blog posts
const blogPosts = [
  { id: "1", title: "The Ultimate Guide to Renter Background Checks", status: "published", author: "Admin", views: 1204, date: "2023-10-20" },
  { id: "2", title: "Understanding Your Rights as a Renter", status: "published", author: "Admin", views: 2345, date: "2023-10-15" },
  { id: "3", title: "How to Handle a Dispute with Your Landlord", status: "draft", author: "Admin", views: 0, date: "2023-10-27" },
  { id: "4", title: "New Feature: Introducing Real-Time Fraud Alerts", status: "published", author: "Admin", views: 850, date: "2023-10-25" },
];

export default function BlogManagerPage() {
  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog Manager</h1>
          <Button>Create New Post</Button>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'success' : 'outline'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{post.views.toLocaleString()}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        {post.status === 'draft' && <Button variant="success" size="sm">Publish</Button>}
                        <Button variant="destructive" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}

// Mock UI components for structural presentation
const Card = ({ children }) => <div className="bg-white rounded-lg shadow">{children}</div>;
const CardContent = ({ children }) => <div className="p-0">{children}</div>;
