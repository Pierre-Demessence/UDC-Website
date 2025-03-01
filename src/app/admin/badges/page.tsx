import { prisma } from "@/lib/prisma";
import { BadgeList } from "./BadgeList";

export default async function AdminBadgesPage() {
  const badges = await prisma.badge.findMany({
    orderBy: { name: 'asc' },
  });

  const badgeStats = await prisma.userBadge.groupBy({
    by: ['badgeId'],
    _count: true,
  });

  const badgeStatsMap = Object.fromEntries(
    badgeStats.map(stat => [stat.badgeId, stat._count])
  );

  const badgesWithStats = badges.map(badge => ({
    ...badge,
    usageCount: badgeStatsMap[badge.id] || 0
  }));

  return <BadgeList badges={badgesWithStats} />;
}