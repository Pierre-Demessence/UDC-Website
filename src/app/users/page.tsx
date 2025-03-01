import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, Badge, Card, Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import Link from "next/link";

export default async function UsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    include: {
      earnedBadges: {
        include: {
          badge: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">Users</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {users.map((user) => (
          <Card 
            key={user.id} 
            component={Link}
            href={`/users/${user.id}`}
            padding="md"
            radius="md"
            withBorder
          >
            <Group>
              <Avatar src={user.image} size="lg" radius="xl" />
              <div style={{ flex: 1 }}>
                <Text size="lg" fw={500} mb={5}>
                  {user.name}
                </Text>
                <Group gap={5}>
                  <Badge size="sm" variant="light">
                    {user.role}
                  </Badge>
                  {user.earnedBadges.length > 0 && (
                    <Badge size="sm" variant="light">
                      {user.earnedBadges.length} badges
                    </Badge>
                  )}
                </Group>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}