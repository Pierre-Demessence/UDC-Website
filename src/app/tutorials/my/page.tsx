import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge, Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateTutorialButton } from "../CreateTutorialButton";

export default async function MyTutorialsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const tutorials = await prisma.tutorial.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      ratings: {
        select: {
          score: true,
        }
      },
      _count: {
        select: {
          comments: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const tutorialsWithStats = tutorials.map(tutorial => {
    const avgRating = tutorial.ratings.length > 0
      ? tutorial.ratings.reduce((sum: number, r: any) => sum + r.score, 0) / tutorial.ratings.length
      : null;
    
    const { ratings, ...rest } = tutorial;
    return {
      ...rest,
      avgRating,
    };
  });

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>My Tutorials</Title>
        <CreateTutorialButton />
      </Group>

      <Stack gap="md">
        {tutorialsWithStats.map((tutorial) => (
          <Card key={tutorial.id} withBorder>
            <Group justify="space-between" align="start">
              <Stack gap="xs">
                <Title order={3} size="h4">{tutorial.title}</Title>
                <Text size="sm" lineClamp={2}>
                  {tutorial.content}
                </Text>
                <Group gap="xs">
                  {tutorial.avgRating && (
                    <Text size="sm" c="dimmed">
                      {tutorial.avgRating.toFixed(1)} ★
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    • {tutorial._count.comments} comments
                  </Text>
                  {!tutorial.isValidated && (
                    <Badge color="yellow">Pending Validation</Badge>
                  )}
                  {!tutorial.isPublished && (
                    <Badge color="gray">Draft</Badge>
                  )}
                </Group>
              </Stack>
              <Button component={Link} href={`/tutorials/${tutorial.id}/edit`}>
                Edit
              </Button>
            </Group>
          </Card>
        ))}

        {tutorials.length === 0 && (
          <Text c="dimmed" ta="center">You haven't created any tutorials yet</Text>
        )}
      </Stack>
    </Container>
  );
}