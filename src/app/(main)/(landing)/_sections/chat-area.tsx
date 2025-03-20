"use client";

import { Message } from "ai";
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

import { useChat } from "@ai-sdk/react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PreviewMessage } from "./preview-message";
import { Message as MessageCard } from "./message";
import { useScrollToBottom } from "@/hooks/use-scroll-bottom";

export function ChatAreaSection({
  id,
  initialMessages = [],
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { toast } = useToast();

  const { messages, input, handleInputChange, status, handleSubmit, stop } =
    useChat({
      id: id.toString(),
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
      onError: () => {
        toast({
          title: "Something went wrong.",
        });
        stop();
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: "",
    },
    values: {
      prompt: input,
    },
  });

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && <PreviewMessage />}

          {messages.map((msg) => (
            <MessageCard key={msg.id} {...msg} />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <div className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <Form {...form}>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mx-auto border-gray-500 border my-8 rounded-3xl px-4 py-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="w-full py-2 outline-none"
                          placeholder="Ask anything"
                          value={input}
                          onChange={(s) => handleInputChange(s)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();

                              if (status !== "ready") {
                                toast({
                                  title: "Something went wrong",
                                  description:
                                    "Please wait for the model to finish its response!",
                                  variant: "destructive",
                                });
                              } else {
                                handleSubmit();
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full justify-end flex py-2">
                  <LoaderButton isLoading={status !== "ready"}>
                    <CheckIcon className={btnIconStyles} /> Submit
                  </LoaderButton>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
