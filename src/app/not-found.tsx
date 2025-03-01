import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size="lg" py={50}>
      <Stack align="center" gap="xl">
        <Title size="3rem">404</Title>
        <Text size="lg" c="dimmed" ta="center">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Group>
          <Button component={Link} href="/">
            Go back home
          </Button>
          <Button variant="outline" component={Link} href="/tutorials">
            Browse tutorials
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}