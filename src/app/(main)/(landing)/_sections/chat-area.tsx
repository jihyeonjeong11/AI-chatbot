"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ChatAreaSection() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: "ai" },
    { id: 2, text: "How does AI work?", sender: "user" },
  ]);
  return (
    <div className="flex flex-1 justify-between grow basis-auto flex-col overflow-hidden w-full h-[calc(100vh-72px)]">
      {/* infiniteScrollNeeded */}
      <div className="flex flex-col basis-[85%] overflow-y-auto py-14">
        <div className="flex flex-col items-end  px-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[75%] rounded-3xl px-5 py-2.5 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex basis-[15%] text-base mx-auto px-3 md:px-4 w-full lg:px-4 xl:px-5">
        <div className="mx-auto border-gray-500 border w-[80%] my-8 rounded-3xl px-4 py-6">
          <input
            className="w-full py-2 outline-none"
            placeholder="Ask anything"
          />
          <div className="w-full justify-end flex">
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
