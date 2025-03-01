"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

export function Providers({ 
  children,
  session
}: { 
  children: ReactNode,
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <MantineProvider 
        defaultColorScheme="auto"
        theme={{
          components: {
            TextInput: {
              defaultProps: {
                spellCheck: false
              }
            },
            Textarea: {
              defaultProps: {
                spellCheck: false
              }
            }
          }
        }}
      >
        <Notifications />
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
}