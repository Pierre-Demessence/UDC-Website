import { Button, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

export interface BadgeFormData {
  name: string;
  description: string;
  imageUrl?: string;
}

interface BadgeFormProps {
  initialValues?: BadgeFormData;
  onSubmit: (values: BadgeFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function BadgeForm({ initialValues = { name: '', description: '', imageUrl: '' }, onSubmit, onCancel, submitLabel = 'Save' }: BadgeFormProps) {
  const form = useForm({
    initialValues,
    validate: {
      name: (value) => value.trim().length === 0 ? 'Name is required' : null,
      description: (value) => value.trim().length === 0 ? 'Description is required' : null,
    },
  });

  const handleSubmit = async (values: BadgeFormData) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          data-autofocus
          label="Name"
          placeholder="Enter badge name"
          required
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Description"
          placeholder="Enter badge description"
          required
          {...form.getInputProps('description')}
        />
        <TextInput
          label="Image URL"
          placeholder="Enter badge image URL (optional)"
          {...form.getInputProps('imageUrl')}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  );
}