import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, Badge, Button, Container, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import { CommentSection } from "./CommentSection";
import { RatingInput } from "./RatingInput";
import { ModeratorActions } from "./ModeratorActions";
import Link from "next/link";

// Add this client component at the top of the file
function TutorialContent({ content }: { content: string }) {
  return (
    <div 
      className="prose dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

interface Props {
  params: {
    id: string;
  };
}

export default async function TutorialPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  
  const tutorial = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      },
      ratings: {
        select: {
          score: true,
          userId: true,
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!tutorial) {
    notFound();
  }

  // Only show published and validated tutorials to regular users
  if ((!tutorial.isPublished || !tutorial.isValidated) && 
      (!session?.user || (session.user.role === "USER" && session.user.id !== tutorial.author.id))) {
    notFound();
  }

  const avgRating = tutorial.ratings.length > 0
    ? tutorial.ratings.reduce((sum, r) => sum + r.score, 0) / tutorial.ratings.length
    : null;

  const userRating = session?.user
    ? tutorial.ratings.find(r => r.userId === session.user.id)?.score
    : null;

  const canModerate = session?.user?.role === "ADMIN" || session?.user?.role === "TUTORIAL_MODERATOR";
  const canEdit = session?.user && (session.user.id === tutorial.author.id || session.user.role === "ADMIN");

  return (
    <Container size="lg" py="xl">
      <Paper p="md" withBorder>
        <Stack gap="md">
          {/* Header */}
          <Group justify="space-between" align="start">
            <Stack gap="xs">
              <Title order={2}>{tutorial.title}</Title>
              <Group>
                <Avatar src={tutorial.author.image} alt={tutorial.author.name || ""} />
                <Text>By {tutorial.author.name}</Text>
                {!tutorial.isValidated && <Badge color="yellow">Pending Validation</Badge>}
                {!tutorial.isPublished && <Badge color="gray">Draft</Badge>}
              </Group>
            </Stack>

            <Group>
              {canEdit && (
                <Button component={Link} href={`/tutorials/${tutorial.id}/edit`} variant="light">
                  Edit Tutorial
                </Button>
              )}
              {canModerate && (
                <ModeratorActions tutorialId={tutorial.id} isValidated={tutorial.isValidated} />
              )}
            </Group>
          </Group>

          {/* Content */}
          <TutorialContent content={tutorial.content} />

          {/* Rating */}
          {session?.user && tutorial.isValidated && (
            <RatingInput
              tutorialId={tutorial.id}
              initialRating={userRating}
              avgRating={avgRating}
              totalRatings={tutorial.ratings.length}
            />
          )}

          {/* Comments */}
          <CommentSection
            tutorialId={tutorial.id}
            comments={tutorial.comments}
            currentUser={session?.user || null}
          />
        </Stack>
      </Paper>
    </Container>
  );
}