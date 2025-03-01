'use client';

import { deleteBadge } from "@/app/api/badges/actions";
import { ActionIcon, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { EditBadgeModal } from "./EditBadgeModal";

interface BadgeAdminActionsProps {
  badge: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

export function BadgeAdminActions({ badge }: BadgeAdminActionsProps) {
  const handleEdit = () => {
    modals.open({
      title: `Edit Badge: ${badge.name}`,
      children: <EditBadgeModal badge={badge} />,
    });
  };

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: 'Delete Badge',
      children: `Are you sure you want to delete "${badge.name}"? This action is irreversible.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteBadge(badge.id);
          notifications.show({
            title: 'Badge Deleted',
            message: `${badge.name} has been deleted successfully.`,
            color: 'green',
          });
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete badge. Please try again.',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="Menu">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEdit size={14} />} onClick={handleEdit}>
          Edit
        </Menu.Item>
        <Menu.Item 
          leftSection={<IconTrash size={14} />} 
          color="red" 
          onClick={handleDelete}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}