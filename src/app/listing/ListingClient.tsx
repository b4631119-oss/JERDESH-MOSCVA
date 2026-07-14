"use client";
import { useState } from "react";
import Comment from "@/src/components/comment/Comment";
import AuthModal from "@/src/components/Auth/AuthModal";

export default function ListingClient({ postId }: { postId: number }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <Comment postId={postId} onOpenAuth={() => setIsAuthOpen(true)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}