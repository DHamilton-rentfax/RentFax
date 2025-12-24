"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Department } from "@/types";

export default function DepartmentsPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch {
      toast({ title: "Error", description: "Could not load departments.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newDept.trim()) return;
    try {
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDept }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create department");
      toast({ title: "Department Created", description: newDept });
      setDepartments((prev) => [...prev, { ...data, createdAt: Date.now(), createdBy: user?.id }]);
      setNewDept("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Department Deleted" });
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Departments</h1>
      </header>

      <div className="flex gap-2">
        <Input
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="New Department Name"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader>
              <CardTitle>{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Created {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : "—"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="destructive" size="sm" onClick={() => handleDelete(dept.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
