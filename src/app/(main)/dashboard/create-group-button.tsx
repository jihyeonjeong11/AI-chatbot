"use client";

import { InteractiveOverlay } from "@/components/interactive-overlay";
import { Button } from "@/components/ui/button";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateGroupForm } from "./create-group-form";

export function CreateGroupButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={"Create Group"}
        description={"Create a new group to start managing your events."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateGroupForm />}
      />
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Create Group
      </Button>
    </>
  );
}
