import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, Badge, Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminTutorialsPage() {
  const session = await auth();
  if (!session?.user || 
      (session.user.role !== "ADMIN" && session.user.role !== "TUTORIAL_MODERATOR")) {
    redirect("/");
  }

  const pendingTutorials = await prisma.tutorial.findMany({
    where: {
      isValidated: false,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <>
      <Title order={2} mb="xl">Pending Tutorials</Title>

      <Stack gap="md">
        {pendingTutorials.map((tutorial) => (
          <Card key={tutorial.id} withBorder>
            <Group justify="space-between" align="start">
              <Stack gap="xs">
                <Title order={3} size="h4">{tutorial.title}</Title>
                <Group>
                  <Avatar src={tutorial.author.image} alt={tutorial.author.name || ""} />
                  <Text>By {tutorial.author.name}</Text>
                  <Text size="sm" c="dimmed">
                    • {new Date(tutorial.createdAt).toLocaleDateString()}
                  </Text>
                </Group>
                <Text size="sm" lineClamp={2}>
                  {tutorial.content}
                </Text>
              </Stack>
              <Button component={Link} href={`/tutorials/${tutorial.id}`}>
                Review
              </Button>
            </Group>
          </Card>
        ))}

        {pendingTutorials.length === 0 && (
          <Text c="dimmed" ta="center">No pending tutorials to review</Text>
        )}
      </Stack>
    </>
  );
}