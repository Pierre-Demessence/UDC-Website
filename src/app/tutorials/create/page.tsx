import { auth } from "@/auth";
import { TutorialForm } from "@/components/TutorialForm";
import { Container, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function CreateTutorialPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">Create Tutorial</Title>
      <TutorialForm type="create" />
    </Container>
  );
}