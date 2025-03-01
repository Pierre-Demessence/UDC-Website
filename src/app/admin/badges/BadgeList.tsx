'use client';

import { Grid, Group, Image, Stack, Text, Title } from "@mantine/core";
import { CreateBadgeButton } from "@/app/badges/CreateBadgeButton";
import { BadgeAdminActions } from "@/app/badges/BadgeAdminActions";
import { IconBadge } from "@tabler/icons-react";

interface BadgeWithStats {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  usageCount: number;
}

interface BadgeListProps {
  badges: BadgeWithStats[];
}

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>Badge Management</Title>
        <CreateBadgeButton />
      </Group>

      <Grid>
        {badges.map((badge) => (
          <Grid.Col key={badge.id} span={12}>
            <Group justify="space-between" p="md" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
              <Group align="flex-start">
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
                <Stack gap="xs">
                  <Text fw={500} size="lg">{badge.name}</Text>
                  <Text size="sm" c="dimmed">{badge.description}</Text>
                  <Text size="sm">Times awarded: {badge.usageCount}</Text>
                </Stack>
              </Group>
              <BadgeAdminActions badge={badge} />
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}