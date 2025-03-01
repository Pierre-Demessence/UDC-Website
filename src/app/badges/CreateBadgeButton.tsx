'use client';

import { createBadge } from "@/app/api/badges/actions";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { BadgeForm, BadgeFormData } from "./BadgeForm";

export function CreateBadgeButton() {
  const handleSubmit = async (values: BadgeFormData) => {
    try {
      await createBadge(values);
      notifications.show({
        title: 'Badge Created',
        message: `${values.name} has been created successfully.`,
        color: 'green',
      });
      modals.closeAll();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create badge. Please try again.',
        color: 'red',
      });
    }
  };

  const openCreateModal = () => {
    modals.open({
      title: 'Create New Badge',
      children: (
        <BadgeForm
          onSubmit={handleSubmit}
          onCancel={() => modals.closeAll()}
          submitLabel="Create Badge"
        />
      ),
    });
  };

  return (
    <Button 
      leftSection={<IconPlus size={16} />}
      onClick={openCreateModal}
    >
      Create Badge
    </Button>
  );
}