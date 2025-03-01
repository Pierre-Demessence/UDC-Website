"use client";

import { Avatar, Button, Container, Group, Menu, Text, Title, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaCaretDown, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === 'ADMIN';
  
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Projects', href: '/projects' },
    { label: 'Game Jams', href: '/gamejams' },
    { label: 'Users', href: '/users' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <header>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Group>
            <Title order={3} component={Link} href="/" style={{ textDecoration: 'none' }} c="black">
              UDC
            </Title>
            
            <Group ml="xl" gap="xl">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  style={{
                    textDecoration: 'none',
                    fontWeight: pathname === link.href ? 'bold' : 'normal',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Group>
          </Group>

          <Group>
            {session ? (
              <Menu position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="xs">
                      <Avatar 
                        src={session.user?.image} 
                        alt={session.user?.name || "User"} 
                        radius="xl" 
                        size="sm" 
                      />
                      <Text size="sm" fw={500}>
                        {session.user?.name}
                      </Text>
                      <FaCaretDown size="0.8rem" />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<FaUser size="0.8rem" />} component={Link} href="/profile">
                    Profile
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<FaSignOutAlt size="0.8rem" />} 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    color="red"
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button onClick={() => signIn('discord')}>Sign In</Button>
            )}
          </Group>
        </Group>
      </Container>
    </header>
  );
}