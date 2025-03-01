'use client';

import { Card, Group, Stack, TextInput, Title, Button, ActionIcon, Table, Modal } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

type GameJam = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    itchIoUrl: string;
};

export default function GameJamsAdminPage() {
    const [jams, setJams] = useState<GameJam[]>([]);
    const [editingJam, setEditingJam] = useState<GameJam | null>(null);
    
    const form = useForm({
        initialValues: {
            title: '',
            startDate: null as Date | null,
            endDate: null as Date | null,
            itchIoUrl: '',
        },
        validate: {
            title: (value) => !value ? 'Title is required' : null,
            startDate: (value) => !value ? 'Start date is required' : null,
            endDate: (value, values) => {
                if (!value) return 'End date is required';
                if (values.startDate && value < values.startDate) return 'End date must be after start date';
                return null;
            },
            itchIoUrl: (value) => !value ? 'itch.io URL is required' : null,
        }
    });

    const editForm = useForm({
        initialValues: {
            id: '',
            title: '',
            startDate: null as Date | null,
            endDate: null as Date | null,
            itchIoUrl: '',
        },
        validate: {
            title: (value) => !value ? 'Title is required' : null,
            startDate: (value) => !value ? 'Start date is required' : null,
            endDate: (value, values) => {
                if (!value) return 'End date is required';
                if (values.startDate && value < values.startDate) return 'End date must be after start date';
                return null;
            },
            itchIoUrl: (value) => !value ? 'itch.io URL is required' : null,
        }
    });

    const fetchJams = async () => {
        const res = await fetch('/api/gamejams');
        const data = await res.json();
        setJams(data.map((jam: any) => ({
            ...jam,
            startDate: new Date(jam.startDate),
            endDate: new Date(jam.endDate),
        })));
    };

    useEffect(() => {
        fetchJams();
    }, []);

    const handleSubmit = async (values: typeof form.values) => {
        await fetch('/api/gamejams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        form.reset();
        fetchJams();
    };

    const handleEdit = (jam: GameJam) => {
        setEditingJam(jam);
        editForm.setValues({
            id: jam.id,
            title: jam.title,
            startDate: jam.startDate,
            endDate: jam.endDate,
            itchIoUrl: jam.itchIoUrl,
        });
    };

    const handleUpdate = async (values: typeof editForm.values) => {
        await fetch('/api/gamejams', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        setEditingJam(null);
        editForm.reset();
        fetchJams();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this game jam?')) return;
        
        await fetch(`/api/gamejams?id=${id}`, {
            method: 'DELETE',
        });
        fetchJams();
    };

    return (
            <Stack>
                <Title order={2}>Game Jams Management</Title>
                
                <Card withBorder>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="Title"
                                required
                                {...form.getInputProps('title')}
                            />
                            <Group grow>
                                <DateInput
                                    label="Start Date"
                                    required
                                    {...form.getInputProps('startDate')}
                                />
                                <DateInput
                                    label="End Date"
                                    required
                                    {...form.getInputProps('endDate')}
                                />
                            </Group>
                            <TextInput
                                label="itch.io URL"
                                required
                                {...form.getInputProps('itchIoUrl')}
                            />
                            <Button type="submit">Create Game Jam</Button>
                        </Stack>
                    </form>
                </Card>

                <Card withBorder>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Start Date</Table.Th>
                                <Table.Th>End Date</Table.Th>
                                <Table.Th>itch.io URL</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {jams.map(jam => (
                                <Table.Tr key={jam.id}>
                                    <Table.Td>{jam.title}</Table.Td>
                                    <Table.Td>{jam.startDate.toLocaleDateString()}</Table.Td>
                                    <Table.Td>{jam.endDate.toLocaleDateString()}</Table.Td>
                                    <Table.Td>{jam.itchIoUrl}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => handleEdit(jam)}
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => handleDelete(jam.id)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>

                <Modal 
                    opened={!!editingJam} 
                    onClose={() => {
                        setEditingJam(null);
                        editForm.reset();
                    }}
                    title="Edit Game Jam"
                >
                    <form onSubmit={editForm.onSubmit(handleUpdate)}>
                        <Stack>
                            <TextInput
                                label="Title"
                                required
                                {...editForm.getInputProps('title')}
                            />
                            <Group grow>
                                <DateInput
                                    label="Start Date"
                                    required
                                    {...editForm.getInputProps('startDate')}
                                />
                                <DateInput
                                    label="End Date"
                                    required
                                    {...editForm.getInputProps('endDate')}
                                />
                            </Group>
                            <TextInput
                                label="itch.io URL"
                                required
                                {...editForm.getInputProps('itchIoUrl')}
                            />
                            <Button type="submit">Update Game Jam</Button>
                        </Stack>
                    </form>
                </Modal>
            </Stack>
    );
}