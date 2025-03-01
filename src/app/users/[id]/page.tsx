import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, Badge, Box, Code, Container, Grid, GridCol, Group, Paper, Text, Title } from "@mantine/core";
import { IconBadge } from '@tabler/icons-react';
import UserBadgeManager from "@/app/users/UserBadgeManager";
import BadgeItem from "@/app/users/BadgeItem";

interface Props {
  params: {
    id: Promise<string>;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface UserBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  awardedAt: Date;
}

interface User {
  id: string;
  name: string;
  image: string | null;
  role: string;
  earnedBadges: UserBadge[];
}

async function UserProfile({ id }: { id: string }) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  console.log(id);
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      earnedBadges: {
        include: {
          badge: true
        },
        orderBy: {
          awardedAt: 'desc'
        }
      }
    }
  }) as User | null;

  if (!user) {
    notFound();
  }

  return (
    <Container size="lg" py="xl">
      <Paper p="xl" radius="md" withBorder mb="xl">
        <Group wrap="nowrap">
          <Avatar src={user.image} size="xl" radius="xl" />
          <div>
            <Title order={2}>{user.name}</Title>
            <Badge size="lg" mt="xs">{user.role}</Badge>
          </div>
        </Group>

        {isAdmin && (
          <Box mt="lg">
            <Title order={4} mb="xs">Debug Information</Title>
              <Code block={true}>
                {JSON.stringify(
                  {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: session?.user?.email,
                    permissions: session?.user?.permissions,
                    session: {
                      ...session,
                      user: undefined // Exclude user to avoid duplication
                    }
                  }, 
                  null, 
                  2
                )}
              </Code>
          </Box>
        )}
      </Paper>

      <Grid>
        <GridCol span={12}>
          <Box mb="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Badges</Title>
              {isAdmin && <UserBadgeManager userId={user.id} earnedBadges={user.earnedBadges} />}
            </Group>
            
            {user.earnedBadges.length > 0 ? (
              <Grid>
                {user.earnedBadges.map((userBadge) => (
                  <GridCol key={userBadge.badge.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <BadgeItem
                      badge={userBadge.badge}
                      awardedAt={userBadge.awardedAt}
                      isAdmin={isAdmin}
                    />
                  </GridCol>
                ))}
              </Grid>
            ) : (
              <Text c="dimmed">No badges earned yet.</Text>
            )}
          </Box>
        </GridCol>
      </Grid>
    </Container>
  );
}

export default async function UserProfilePage({ params, searchParams }: Props) {
  
  const { id} = await params;
  console.log(id);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile id={id} />
    </Suspense>
  );
}