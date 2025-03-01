'use client';

import { awardBadge, removeBadgeFromUser } from "@/app/api/badges/actions";
import { ActionIcon, Button, Combobox, Group, Modal, Stack, Text, useCombobox } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface UserBadge {
  badge: Badge;
  awardedAt: Date;
}

interface Props {
  userId: string;
  earnedBadges: UserBadge[];
}

// Make sure to explicitly mark this as a default export
export default function UserBadgeManager({ userId, earnedBadges }: Props) {
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const combobox = useCombobox();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    fetch('/api/badges')
      .then(res => res.json())
      .then((badges: Badge[]) => {
        const earnedBadgeIds = new Set(earnedBadges.map(eb => eb.badge.id));
        setAvailableBadges(badges.filter(b => !earnedBadgeIds.has(b.id)));
      });

    // Add event listener for badge removal
    const handleRemoveBadge = (event: CustomEvent<{ badgeId: string; badgeName: string }>) => {
      handleRemoveBadgeClick(event.detail.badgeId, event.detail.badgeName);
    };

    window.addEventListener('removeBadge', handleRemoveBadge as EventListener);

    return () => {
      window.removeEventListener('removeBadge', handleRemoveBadge as EventListener);
    };
  }, [earnedBadges]);

  const handleAddBadge = async () => {
    if (!selectedBadge) return;

    try {
      await awardBadge(userId, selectedBadge.id);
      notifications.show({
        title: 'Badge Awarded',
        message: `${selectedBadge.name} has been awarded successfully.`,
        color: 'green',
      });
      setIsModalOpen(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to award badge. Please try again.',
        color: 'red',
      });
    }
  };

  const handleRemoveBadgeClick = (badgeId: string, badgeName: string) => {
    modals.openConfirmModal({
      title: 'Remove Badge',
      children: (
        <Text size="sm">
          Are you sure you want to remove the badge "{badgeName}" from this user?
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await removeBadgeFromUser(userId, badgeId);
          notifications.show({
            title: 'Badge Removed',
            message: `${badgeName} has been removed successfully.`,
            color: 'green',
          });
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to remove badge. Please try again.',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <>
      <Button 
        leftSection={<IconPlus size={16} />}
        onClick={() => setIsModalOpen(true)}
        disabled={availableBadges.length === 0}
      >
        Add Badge
      </Button>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        title="Award Badge"
      >
        <Stack>
          <Combobox
            store={combobox}
            onOptionSubmit={(value) => {
              const badge = availableBadges.find(b => b.id === value);
              setSelectedBadge(badge || null);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <Button
                onClick={() => combobox.toggleDropdown()}
                variant="default"
                justify="space-between"
                rightSection={combobox.dropdownOpened ? <IconX size={16} /> : <IconPlus size={16} />}
              >
                {selectedBadge?.name || 'Select a badge'}
              </Button>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {availableBadges.map((badge) => (
                  <Combobox.Option value={badge.id} key={badge.id}>
                    <Group>
                      <Text>{badge.name}</Text>
                      <Text size="xs" c="dimmed">{badge.description}</Text>
                    </Group>
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBadge} disabled={!selectedBadge}>
              Award Badge
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}