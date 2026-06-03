"use client";

import React, { use } from "react";
import { useBlog } from "@/context/BlogContext";
import { PostView } from "@/components/PostView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { posts } = useBlog();

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        border: "1px solid var(--naver-border)",
        borderRadius: "2px"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>포스트를 찾을 수 없습니다.</h2>
        <p style={{ marginTop: "10px", color: "var(--naver-text-sub)", fontSize: "13px" }}>
          삭제되었거나 존재하지 않는 글입니다.
        </p>
      </div>
    );
  }

  return <PostView post={post} />;
}
