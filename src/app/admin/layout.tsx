import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Container, Group, NavLink, Paper } from "@mantine/core";
import { IconBadge, IconList } from "@tabler/icons-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Container size="lg" py="xl">
      <Group align="start" gap="lg">
        <Paper w={200} withBorder>
          <NavLink
            component={Link}
            href="/admin"
            label="Dashboard"
          />
          <NavLink
            component={Link}
            href="/admin/badges"
            label="Badges"
            leftSection={<IconBadge size={16} />}
          />
          <NavLink
            component={Link}
            href="/admin/tutorials"
            label="Tutorials"
            leftSection={<IconList size={16} />}
          />
        </Paper>
        <Paper p="md" style={{ flex: 1 }} withBorder>
          {children}
        </Paper>
      </Group>
    </Container>
  );
}