"use client";

import { Group, Rating, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  tutorialId: string;
  initialRating: number | null;
  avgRating: number | null;
  totalRatings: number;
}

export function RatingInput({ tutorialId, initialRating, avgRating, totalRatings }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRate(value: number) {
    setLoading(true);
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate tutorial");
      }

      router.refresh();
    } catch (error) {
      console.error("Error rating tutorial:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="xs">
      <Group>
        <Rating
          value={initialRating || 0}
          onChange={handleRate}
          readOnly={loading}
        />
        {avgRating !== null && (
          <Text size="sm" c="dimmed">
            Average: {avgRating.toFixed(1)} ({totalRatings} rating{totalRatings !== 1 ? "s" : ""})
          </Text>
        )}
      </Group>
    </Stack>
  );
}