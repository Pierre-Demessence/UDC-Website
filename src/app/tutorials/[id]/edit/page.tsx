import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, Container, Stack, TextInput, Textarea, Title } from "@mantine/core";
import { notFound, redirect } from "next/navigation";
import { TutorialForm } from "../../../../components/TutorialForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditTutorialPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
        }
      }
    }
  });

  if (!tutorial) {
    notFound();
  }

  // Only allow author and admins to edit
  if (tutorial.author.id !== session.user.id && 
      session.user.role !== "ADMIN") {
    redirect("/tutorials");
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">Edit Tutorial</Title>
      <TutorialForm 
        type="edit"
        tutorialId={tutorial.id}
        initialData={{
          title: tutorial.title,
          content: tutorial.content,
          isPublished: tutorial.isPublished,
        }}
      />
    </Container>
  );
}