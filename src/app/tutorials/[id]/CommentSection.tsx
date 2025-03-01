"use client";

import { ActionIcon, Avatar, Button, Group, Paper, Stack, Text, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
}

interface Props {
  tutorialId: string;
  comments: Comment[];
  currentUser: User | null;
}

export function CommentSection({ tutorialId, comments, currentUser }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      setContent("");
      router.refresh();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      notifications.show({
        title: "Success",
        message: "Comment deleted successfully",
        color: "green",
      });

      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete comment",
        color: "red",
      });
    }
  }

  return (
    <Stack>
      <Text fw={500}>Comments</Text>

      {currentUser && (
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <Textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={2}
              required
            />
            <Button type="submit" loading={loading} disabled={!content.trim()}>
              Post Comment
            </Button>
          </Stack>
        </form>
      )}

      <Stack gap="md">
        {comments.map((comment) => (
          <Paper key={comment.id} p="md" withBorder>
            <Group gap="sm" align="start">
              <Avatar src={comment.author.image} alt={comment.author.name || ""} />
              <Stack gap={4} style={{ flex: 1 }}>
                <Group gap="xs">
                  <Text fw={500}>{comment.author.name}</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                  {currentUser && (currentUser.id === comment.author.id || currentUser.role === "ADMIN") && (
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(comment.id)}
                      title="Delete comment"
                    >
                      <IoTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>
                <Text>{comment.content}</Text>
              </Stack>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}