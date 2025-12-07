"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function NotificationsTestPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState(
    "This is a test notification from the dashboard.",
  );
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          type: "test",
          title,
          body,
          link: "/dashboard/notifications",
        }),
      });
      if (!res.ok) throw new Error("Failed to send notification");
      toast({
        title: "Notification Sent",
        description: "Check the notification bell.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-headline">Test Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send a Test Notification</CardTitle>
          <CardDescription>
            Use this tool to send a notification to your own account to test the
            notification bell functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="body">Body</label>
            <Input
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <Button onClick={sendTestNotification} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Test Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
