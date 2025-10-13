"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const ProviderButtons = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Separator className="shrink" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="shrink" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Button type="button" variant="outline" className="w-full">
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button type="button" variant="outline" className="w-full">
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
};
