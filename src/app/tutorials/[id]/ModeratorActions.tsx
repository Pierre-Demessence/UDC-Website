"use client";

import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  tutorialId: string;
  isValidated: boolean;
}

export function ModeratorActions({ tutorialId, isValidated }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleValidation() {
    setLoading(true);
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isValidated: !isValidated }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tutorial validation status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating tutorial:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete() {
    modals.openConfirmModal({
      title: "Delete Tutorial",
      children: "Are you sure you want to delete this tutorial? This action cannot be undone.",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/tutorials/${tutorialId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete tutorial");
          }

          notifications.show({
            title: "Success",
            message: "Tutorial deleted successfully",
            color: "green",
          });

          router.push("/tutorials");
        } catch (error) {
          console.error("Error deleting tutorial:", error);
          notifications.show({
            title: "Error",
            message: "Failed to delete tutorial",
            color: "red",
          });
        }
      },
    });
  }

  return (
    <Group>
      <Button
        loading={loading}
        onClick={handleValidation}
        variant={isValidated ? "outline" : "filled"}
        color={isValidated ? "orange" : "green"}
      >
        {isValidated ? "Unvalidate" : "Validate"}
      </Button>
      <Button color="red" variant="outline" onClick={handleDelete}>
        Delete Tutorial
      </Button>
    </Group>
  );
}