'use client';

import { updateBadge } from "@/app/api/badges/actions";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { BadgeForm, BadgeFormData } from "./BadgeForm";

interface EditBadgeModalProps {
  badge: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

export function EditBadgeModal({ badge }: EditBadgeModalProps) {
  const handleSubmit = async (values: BadgeFormData) => {
    try {
      // Only send updateable fields
      const updateData = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
      };
      
      await updateBadge(badge.id, updateData);
      notifications.show({
        title: 'Badge Updated',
        message: `${values.name} has been updated successfully.`,
        color: 'green',
      });
      modals.closeAll();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update badge. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <BadgeForm
      initialValues={badge}
      onSubmit={handleSubmit}
      onCancel={() => modals.closeAll()}
      submitLabel="Save Changes"
    />
  );
}