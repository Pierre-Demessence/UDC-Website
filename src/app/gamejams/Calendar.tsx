'use client';

import { useState } from 'react';
import { Card, SegmentedControl, Grid, Stack, Text, Button, Group, Box, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

type GameJam = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    itchIoUrl: string;
};

type CalendarProps = {
    jams: GameJam[];
};

type ViewMode = 'week' | 'month' | 'year';

const Calendar = ({ jams }: CalendarProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    const goToNext = () => {
        const newDate = new Date(currentDate);
        switch (viewMode) {
            case 'week':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case 'year':
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        switch (viewMode) {
            case 'week':
                newDate.setDate(newDate.getDate() - 7);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() - 1);
                break;
            case 'year':
                newDate.setFullYear(newDate.getFullYear() - 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        const jamsInView = jams.filter(jam => {
            return days.some(day => 
                jam.startDate.toDateString() === day.toDateString() ||
                jam.endDate.toDateString() === day.toDateString() ||
                (jam.startDate <= day && jam.endDate >= day)
            );
        });

        return (
            <Grid>
                {days.map((day, i) => (
                    <Grid.Col span={12/7} key={i}>
                        <Card withBorder h="100%">
                            <Stack>
                                <Text size="sm" c="dimmed">
                                    {day.toLocaleDateString(undefined, { weekday: 'short' })}
                                </Text>
                                <Text weight={500}>
                                    {day.getDate()}
                                </Text>
                                {jamsInView.map(jam => (
                                    (jam.startDate <= day && jam.endDate >= day) && (
                                        <Box 
                                            key={jam.id}
                                            bg="blue.1"
                                            p="xs"
                                            style={{ borderRadius: 4 }}
                                        >
                                            <Text size="xs">{jam.title}</Text>
                                        </Box>
                                    )
                                ))}
                            </Stack>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        );
    };

    const renderMonthView = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Get the first day of the week of the first day of the month
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        // Get the last day of the week of the last day of the month
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
        
        const weeks = [];
        let currentWeek = [];
        let currentWeekDate = new Date(startDate);

        while (currentWeekDate <= endDate) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(new Date(currentWeekDate));
            currentWeekDate.setDate(currentWeekDate.getDate() + 1);
        }
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return (
            <Stack>
                <Grid>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                        <Grid.Col span={12/7} key={i}>
                            <Text ta="center" weight={500}>{day}</Text>
                        </Grid.Col>
                    ))}
                </Grid>
                {weeks.map((week, weekIndex) => (
                    <Grid key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                            const jamsOnDay = jams.filter(jam => 
                                jam.startDate <= day && jam.endDate >= day
                            );

                            return (
                                <Grid.Col span={12/7} key={dayIndex}>
                                    <Card 
                                        withBorder 
                                        h={100}
                                        style={{ 
                                            opacity: isCurrentMonth ? 1 : 0.5,
                                        }}
                                    >
                                        <Stack>
                                            <Text size="sm">{day.getDate()}</Text>
                                            {jamsOnDay.map(jam => (
                                                <Box 
                                                    key={jam.id}
                                                    bg="blue.1"
                                                    p={4}
                                                    style={{ borderRadius: 4 }}
                                                >
                                                    <Text size="xs" truncate>{jam.title}</Text>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                ))}
            </Stack>
        );
    };

    const renderYearView = () => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), i, 1);
            return date;
        });

        return (
            <Grid>
                {months.map((month, i) => (
                    <Grid.Col span={3} key={i}>
                        <Card withBorder>
                            <Stack>
                                <Text weight={500}>
                                    {month.toLocaleDateString(undefined, { month: 'long' })}
                                </Text>
                                {jams.filter(jam => 
                                    jam.startDate.getMonth() === month.getMonth() &&
                                    jam.startDate.getFullYear() === month.getFullYear()
                                ).map(jam => (
                                    <Box 
                                        key={jam.id}
                                        bg="blue.1"
                                        p="xs"
                                        style={{ borderRadius: 4 }}
                                    >
                                        <Text size="xs">{jam.title}</Text>
                                        <Text size="xs" c="dimmed">
                                            {jam.startDate.getDate()}-{jam.endDate.getDate()}
                                        </Text>
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        );
    };

    return (
        <Card withBorder>
            <Stack>
                <Group position="apart">
                    <Group>
                        <ActionIcon onClick={goToPrevious}>
                            <IconChevronLeft size={16} />
                        </ActionIcon>
                        <Text>
                            {viewMode === 'week' && (
                                `Week of ${currentDate.toLocaleDateString()}`
                            )}
                            {viewMode === 'month' && (
                                currentDate.toLocaleDateString(undefined, { 
                                    month: 'long',
                                    year: 'numeric'
                                })
                            )}
                            {viewMode === 'year' && (
                                currentDate.getFullYear()
                            )}
                        </Text>
                        <ActionIcon onClick={goToNext}>
                            <IconChevronRight size={16} />
                        </ActionIcon>
                    </Group>
                    <Group>
                        <Button variant="light" onClick={resetToToday}>
                            Today
                        </Button>
                        <SegmentedControl
                            value={viewMode}
                            onChange={(value) => setViewMode(value as ViewMode)}
                            data={[
                                { label: 'Week', value: 'week' },
                                { label: 'Month', value: 'month' },
                                { label: 'Year', value: 'year' },
                            ]}
                        />
                    </Group>
                </Group>

                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'year' && renderYearView()}
            </Stack>
        </Card>
    );
};

export default Calendar;