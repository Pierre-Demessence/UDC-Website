import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, Card, Container, Grid, GridCol, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { CreateTutorialButton } from "./CreateTutorialButton";

interface Tutorial {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  isValidated: boolean;
  createdAt: Date;
  avgRating: number | null;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
  };
}

export default async function TutorialsPage() {
  const session = await auth();
  
  // Only show published and validated tutorials to regular users
  const where: any = {};
  if (!session?.user || session.user.role === "USER") {
    where.isPublished = true;
    where.isValidated = true;
  }

  const tutorials = await prisma.tutorial.findMany({
    where,
    include: {
      author: {
        select: {
          name: true,
          image: true,
        }
      },
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

  // Calculate average ratings
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
        <Title order={2}>Tutorials</Title>
        {session?.user && (
          <CreateTutorialButton />
        )}
      </Group>

      <Grid>
        {tutorialsWithStats.map((tutorial: Tutorial) => (
          <GridCol key={tutorial.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card component={Link} href={`/tutorials/${tutorial.id}`} padding="md" radius="md" withBorder>
              <Stack gap="xs">
                <Title order={3} size="h4">{tutorial.title}</Title>
                <Text size="sm" lineClamp={2} c="dimmed">
                  {tutorial.content}
                </Text>
                <Group gap="xs" wrap="nowrap">
                  <Text size="sm" c="dimmed">
                    By {tutorial.author.name}
                  </Text>
                  {tutorial.avgRating && (
                    <Text size="sm" c="dimmed">
                      • {tutorial.avgRating.toFixed(1)} ★
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    • {tutorial._count.comments} comments
                  </Text>
                </Group>
                {(!tutorial.isValidated || !tutorial.isPublished) && (
                  <Text size="sm" c="yellow">
                    {!tutorial.isValidated ? "Pending Validation" : "Draft"}
                  </Text>
                )}
              </Stack>
            </Card>
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
}