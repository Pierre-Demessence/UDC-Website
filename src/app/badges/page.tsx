import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge, Container, Grid, Group, Text, Title } from "@mantine/core";
import { BadgeAdminActions } from "./BadgeAdminActions";
import { CreateBadgeButton } from "./CreateBadgeButton";

export default async function BadgesPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';
  
  const badges = await prisma.badge.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Badges</Title>
        {isAdmin && <CreateBadgeButton />}
      </Group>

      <Grid>
        {badges.map((badge) => (
          <Grid.Col key={badge.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Group justify="space-between" align="start">
              <Group>
                <Badge 
                  size="xl"
                  styles={{
                    root: {
                      textTransform: 'none',
                    }
                  }}
                >
                  {badge.name}
                </Badge>
                <Text size="sm" c="dimmed">{badge.description}</Text>
              </Group>
              {isAdmin && <BadgeAdminActions badge={badge} />}
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}