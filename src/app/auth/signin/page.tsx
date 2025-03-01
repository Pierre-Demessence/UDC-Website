import { signIn } from "next-auth/react";
import { Button, Container, Stack, Title, Text, Paper } from "@mantine/core";
import { FaDiscord } from "react-icons/fa";

export default function SignIn() {
  return (
    <Container size="xs" pt="xl">
      <Paper shadow="md" p="md" radius="md" withBorder>
        <Stack>
          <Title order={2} ta="center">Sign in to UDC Website</Title>
          <Text c="dimmed" size="sm" ta="center">
            Sign in with your Discord account to access all features
          </Text>
          
          <Button
            onClick={() => signIn("discord", { callbackUrl: "/" })}
            leftSection={<FaDiscord />}
            variant="filled"
            color="indigo"
            size="lg"
          >
            Continue with Discord
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}