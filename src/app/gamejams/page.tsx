import { Card, Group, Stack, Title, Text, Button } from '@mantine/core';
import Link from 'next/link';
import Calendar from './Calendar';
import { prisma } from "@/lib/prisma";

type GameJam = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    itchIoUrl: string;
};

export default async function GameJamsPage() {
    const jams = await prisma.gameJam.findMany({
        orderBy: {
            startDate: 'asc'
        },
        where: {
            startDate: {
                gte: new Date() // Only get upcoming jams
            }
        }
    });

    // Convert Prisma dates to JavaScript Date objects
    const parsedJams = jams.map(jam => ({
        ...jam,
        startDate: new Date(jam.startDate),
        endDate: new Date(jam.endDate)
    }));

    return (
        <Stack>
            <Title>Upcoming Game Jams</Title>

            <Group grow>
                <Stack>
                    {parsedJams.map(jam => (
                        <Card key={jam.id} withBorder>
                            <Stack>
                                <Title order={3}>{jam.title}</Title>
                                <Group>
                                    <Text>Start: {jam.startDate.toLocaleDateString()}</Text>
                                    <Text>End: {jam.endDate.toLocaleDateString()}</Text>
                                </Group>
                                <Button 
                                    component="a" 
                                    href={jam.itchIoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on itch.io
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
                
                <Calendar jams={parsedJams} />
            </Group>
        </Stack>
    );
}