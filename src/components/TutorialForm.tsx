"use client";

import { Button, Stack, Switch, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Link as TiptapLink } from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import ts from 'highlight.js/lib/languages/typescript';
import cs from 'highlight.js/lib/languages/csharp';

const lowlight = createLowlight();

// register languages that you are planning to use
lowlight.register({ ts, cs   });

interface Props {
  type: "create" | "edit";
  tutorialId?: string;
  initialData?: {
    title: string;
    content: string;
    isPublished: boolean;
  };
}

export function TutorialForm({ type, tutorialId, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TiptapLink.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: {
        class: 'rich-text-content',
      },
    },
    immediatelyRender: false,
    onCreate({ editor }) {
      // Force a re-render to prevent hydration issues
      editor.commands.focus('end');
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: editor?.getHTML() || "",
      isPublished: formData.get("isPublished") === "on",
    };

    try {
      const url = type === "create" 
        ? "/api/tutorials"
        : `/api/tutorials/${tutorialId}`;

      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(type === "create" ? "Failed to create tutorial" : "Failed to update tutorial");
      }

      const tutorial = await response.json();
      router.refresh();
      router.push(`/tutorials/${tutorial.id}`);
    } catch (error) {
      console.error("Error saving tutorial:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          required
          label="Title"
          name="title"
          placeholder="Tutorial title"
          defaultValue={initialData?.title}
        />

        <div className="min-h-[300px]">
          {editor && (
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.CodeBlock />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>
          )}
        </div>

        <Switch
          label="Publish tutorial"
          name="isPublished"
          defaultChecked={initialData?.isPublished}
        />

        <Button type="submit" loading={loading}>
          {type === "create" ? "Create" : "Save"} Tutorial
        </Button>
      </Stack>
    </form>
  );
}