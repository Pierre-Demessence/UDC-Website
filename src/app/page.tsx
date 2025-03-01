import { Container, Title, Text, Button, Group, SimpleGrid, Paper, rem } from '@mantine/core';
import { FaBook, FaProjectDiagram, FaCalendarAlt, FaMedal } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <FaBook size={rem(24)} />,
      title: 'Tutorials',
      description: 'Learn game development through community-created tutorials validated by experts',
      link: '/tutorials'
    },
    {
      icon: <FaProjectDiagram size={rem(24)} />,
      title: 'Project Showcase',
      description: 'Share and discover amazing game projects created by the UDC community',
      link: '/projects'
    },
    {
      icon: <FaCalendarAlt size={rem(24)} />,
      title: 'Game Jams',
      description: 'Participate in UDC game jams to improve your skills and earn badges',
      link: '/jams'
    },
    {
      icon: <FaMedal size={rem(24)} />,
      title: 'Badge System',
      description: 'Earn badges and medals as you contribute and participate in the community',
      link: '/badges'
    },
  ];

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

        {/* Features Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={30} mt={50}>
          {features.map((feature, index) => (
            <Paper key={index} p="md" radius="md" withBorder component={Link} href={feature.link} 
              style={{ textDecoration: 'none', color: 'inherit' }}>
              <Group mb="xs">
                {feature.icon}
                <Title order={4}>{feature.title}</Title>
              </Group>
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
