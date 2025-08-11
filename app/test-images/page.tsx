import { Card, CardHeader, CardContent } from '@/components/ui/card';
import * as React from "react";
import { cn } from "@/lib/utils";

export default function TestImagesPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className={cn("text-2xl font-semibold leading-none tracking-tight")}>Test Images Page</h2>
      </CardHeader>
      <CardContent>
        <p>This is a sample page using Card components.</p>
        {/* Add your test images or other content here */}
      </CardContent>
    </Card>
  );
}
