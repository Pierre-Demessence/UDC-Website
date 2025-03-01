"use client";

import { Button } from "@mantine/core";
import Link from "next/link";

export function CreateTutorialButton() {
  return (
    <Button component={Link} href="/tutorials/create">
      Create Tutorial
    </Button>
  );
}