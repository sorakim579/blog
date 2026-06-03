import React, { Suspense } from "react";
import { PostList } from "@/components/PostList";

// PostList uses useSearchParams, so we should wrap it in Suspense 
// to prevent SSR-time client-side-only query bail-out issues in Next.js.
export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: "40px", 
        textAlign: "center", 
        backgroundColor: "#ffffff", 
        border: "1px solid var(--naver-border)" 
      }}>
        로딩 중...
      </div>
    }>
      <PostList />
    </Suspense>
  );
}
