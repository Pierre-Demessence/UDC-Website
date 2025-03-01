'use client';

import { ActionIcon, Badge, Group, Image, Paper, Stack, Text } from '@mantine/core';
import { IconX, IconBadge } from '@tabler/icons-react';

interface BadgeItemProps {
  badge: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  };
  awardedAt: Date;
  isAdmin?: boolean;
}

export default function BadgeItem({ badge, awardedAt, isAdmin }: BadgeItemProps) {
  const handleRemoveBadge = () => {
    const event = new CustomEvent('removeBadge', {
      detail: { badgeId: badge.id, badgeName: badge.name }
    });
    window.dispatchEvent(event);
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack>
        <Group justify="space-between" align="flex-start">
          <Group>
            <div style={{ position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {badge.imageUrl ? (
                <Image
                  src={badge.imageUrl}
                  alt={badge.name}
                  w={48}
                  h={48}
                  fit="contain"
                />
              ) : (
                <IconBadge size={48} style={{ color: 'var(--mantine-color-blue-filled)' }} />
              )}
            </div>
            <div>
              <Badge size="lg" styles={{ root: { textTransform: 'none' } }}>
                {badge.name}
              </Badge>
              <Text size="sm" c="dimmed">
                Awarded {new Date(awardedAt).toLocaleDateString()}
              </Text>
            </div>
          </Group>
          {isAdmin && (
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              title="Remove badge"
              onClick={handleRemoveBadge}
            >
              <IconX size={14} />
            </ActionIcon>
          )}
        </Group>
        <Text size="sm">{badge.description}</Text>
      </Stack>
    </Paper>
  );
}