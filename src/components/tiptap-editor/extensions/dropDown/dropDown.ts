import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from 'nanoid'
import { DropDownNodeView } from "./DropDownNodeView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dropDown: {
      /**
       * Set media
       */
      setDropDown: (options: {
        questionId: string;
        question: string;
        options: { value: string; tags: string[]}[];
        settings: { applyTags: boolean };
      }) => ReturnType;
    };
  }
}

export interface DropDownOptions {
  // inline: boolean, // we have floating support, so block is good enough
  // allowBase64: boolean, // we're not going to allow this
  HTMLAttributes: Record<string, any>;
}

export const Dropdown = Node.create<DropDownOptions>({
  name: "dropDown",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  inline: false,

  group: "block",

  draggable: true,

  addAttributes() {
    return {
      questionId: {
        default: ""
      },
      question: {
        default: null,
      },
      options: {
        default: [],
      },
      settings: { default: { applyTags: true } },
    };
  },

  selectable: true,

  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (el) => ({
          questionId: "dropd_" + nanoid(12),
          question: "",
          options: [{ value: "Option 1", tags: []}],
          settings: {
            applyTags: true
          }
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setDropDown:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DropDownNodeView);
  },
});
