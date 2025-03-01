import { Container, Title, Text, Button, Group, SimpleGrid, Paper, rem } from '@mantine/core';
import { FaBook, FaProjectDiagram, FaCalendarAlt, FaMedal } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Container size="lg" py={50}>
        <div style={{ textAlign: 'center', marginBottom: rem(50) }}>
          <Title>Welcome to Universal Digital Currency</Title>
          <Text size="lg" c="dimmed" mt="md">
            The community hub for UDC game developers to learn, share, and showcase their skills
          </Text>
          
          <Group justify="center" mt={30}>
            <Button size="lg" component={Link} href="/tutorials">
              Explore Tutorials
            </Button>
            <Button size="lg" variant="outline" component={Link} href="/projects">
              Browse Projects
            </Button>
          </Group>
        </div>
      </Container>
    </>
  );
}
