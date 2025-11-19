"use server";

import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title should not be empty");
  }
  if (!content || content.trim().length === 0) {
    errors.push("Content should not be empty");
  }
  if (!image || image.size === 0) {
    errors.push("Image should not be empty");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Image upload failed");
  }

  if (title)
    await storePost({
      title,
      content,
      imageUrl,
      userId: 1,
    });

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
