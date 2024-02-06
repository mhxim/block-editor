"use client"

import { DocEditor } from "@/components/tiptap-editor/TiptapTextEditor";
import Image from "next/image";
import { useMemo } from "react";

export default function Home() {
  const quotes = [
    "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking. -Steve Jobs",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",
    "The way to get started is to quit talking and begin doing. -Walt Disney",
    "The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. -Oprah Winfrey",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. -James Cameron",
    "You may say I'm a dreamer, but I'm not the only one. I hope someday you'll join us. And the world will live as one. -John Lennon"
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <DocEditor
          initialContent={{
            type: "doc",
            content: [
              {
                type: "dBlock",
                content: [
                  {
                    type: "heading",
                    attrs: {
                      level: 1,
                    },
                    content: [
                      {
                        type: "text",
                        text: "Block Editor",
                      },
                    ],
                  },
                ],
              },
              {
                type: "dBlock",
                content: [
                  {
                    type: "blockquote",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: quote
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "dBlock",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "made with 🖤 by mhxim 🇨🇭"
                      },
                    ],
                  },
                ],
              }
            ],
          }}
        />
    </main>
  );
}
