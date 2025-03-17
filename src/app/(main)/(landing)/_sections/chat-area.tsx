"use client";

import { useState } from "react";
import { continueConversation, Message } from "../actions";
import { schema } from "../validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { btnIconStyles } from "@/styles/icons";
import { CheckIcon } from "lucide-react";

import { readStreamableValue } from "ai/rsc";

export function ChatAreaSection() {
  const [conversation, setConversation] = useState<
    (Message & { id: number })[]
  >([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: "",
    },
  });
  return (
    <div className="flex flex-1 justify-between grow basis-auto flex-col overflow-hidden w-full h-[calc(100vh-72px)]">
      <div className="flex flex-col basis-[85%] overflow-y-auto py-14">
        <div className="flex flex-col items-end  px-10">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[75%] rounded-3xl px-5 py-2.5 my-3 ${
                  msg.role === "assistant"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex basis-[15%] text-base mx-auto px-3 md:px-4 w-full lg:px-4 xl:px-5">
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(async (values) => {
              form.reset();

              setConversation([
                ...conversation,
                {
                  role: "user",
                  content: values.prompt,
                  id: conversation.length,
                },
              ]);

              const { messages, newMessage } = await continueConversation([
                ...conversation,
                { role: "user", content: values.prompt },
              ]);

              let textContent = "";

              for await (const delta of readStreamableValue(newMessage)) {
                textContent = `${textContent}${delta}`;
                setConversation([
                  ...messages.map((m, i) => ({ ...m, id: i })),
                  {
                    role: "assistant",
                    content: textContent,
                    id: messages.length,
                  },
                ]);
              }
            })}
          >
            <div className="mx-auto border-gray-500 border w-[80%] my-8 rounded-3xl px-4 py-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        className="w-full py-2 outline-none"
                        placeholder="Ask anything"
                        value={field.value}
                        onChange={(s) => field.onChange(s)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full justify-end flex">
                <LoaderButton isLoading={false}>
                  <CheckIcon className={btnIconStyles} /> Submit
                </LoaderButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
