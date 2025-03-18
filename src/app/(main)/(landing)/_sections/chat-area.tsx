"use client";

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
import { Message } from "./message";

export function ChatAreaSection() {
  const { toast } = useToast();
  const { messages, input, handleInputChange, handleSubmit, status } = useChat(
    {}
  );

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
    <div className="flex flex-1 justify-between grow basis-auto flex-col overflow-hidden w-full h-[calc(100vh-72px)]">
      <div className="flex flex-col basis-[85%] overflow-y-auto py-14">
        {messages.length === 0 && <PreviewMessage />}
        <div className="flex flex-col items-center gap-4 px-10">
          {messages.map((msg) => (
            <Message {...msg} />
          ))}
        </div>
      </div>

      <div className="flex basis-[15%] text-base mx-auto px-3 md:px-4 w-full lg:px-4 xl:px-5">
        <Form {...form}>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mx-auto border-gray-500 border w-[80%] my-8 rounded-3xl px-4 py-6">
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
  );
}
