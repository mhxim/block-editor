import {
  RiCodeBoxLine,
  RiCodeLine,
  RiDoubleQuotesL,
  RiH1,
  RiH2,
  RiH3,
  RiListOrdered,
  RiListUnordered,
  RiText,
} from "react-icons/ri";
/* @unocss-include */
import { Editor, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";

import { stopPrevent } from "../../utils";
import { CommandList } from "./CommandList";
import { IconType } from "react-icons";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineTable,
  AiOutlineUnderline,
} from "react-icons/ai";
import { store } from "../../../../store";
import { RxDividerHorizontal } from "react-icons/rx";
import { setBlockSelectionActive } from "@/slices/editorSlice";
import { nanoid } from "nanoid";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";

export interface BlockSelectionItem {
  title: string;
  command: (params: { editor: Editor; range: Range }) => void;
  icon: IconType;
  shortcut: string;
  type: string;
  desc: string;
}

const BlockSelectionItems: Partial<BlockSelectionItem>[] = [
  // {
  //   type: "divider",
  //   title: "Basic Blocks",
  // },
  {
    title: "Drop-down",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setDropDown({
          questionId: "dropd_" + nanoid(12),
          question: "",
          options: [{ value: "Option 1", tags: [] }],
          settings: { applyTags: true },
        })
        .run();
    },
    icon: MdOutlineArrowDropDownCircle,
    shortcut: "",
  },
  {
    title: "Text",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
    icon: RiText,
    shortcut: "#",
  },
  {
    title: "Heading 1",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
    icon: RiH1,
    shortcut: "#",
  },
  {
    title: "Heading 2",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
    icon: RiH2,
    shortcut: "##",
  },
  {
    title: "Heading 3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
    icon: RiH3,
    shortcut: "###",
  },
  {
    title: "Ordered List",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
    icon: RiListOrdered,
    shortcut: "1.",
  },
  {
    title: "Bullet List",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    icon: RiListUnordered,
    shortcut: "-",
  },
  // {
  //   title: "Task List",
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).toggleTaskList().run();
  //   },
  //   icon: "i-ri-list-check-2",
  // },
  {
    title: "Blockquote",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
    icon: RiDoubleQuotesL,
    shortcut: ">",
  },
  // {
  //   title: "Horizontal Divider",
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  //   },
  //   icon: RxDividerHorizontal,
  //   shortcut: "---",
  // },
  // {
  //   title: "Code Block",
  //   command: ({ editor, range }) => {
  //     editor
  //       .chain()
  //       .focus()
  //       .deleteRange(range)
  //       .setCodeBlock({ language: "auto" })
  //       .run();
  //   },
  //   icon: RiCodeBoxLine,
  //   shortcut: "```",
  // },
  // {
  //   title: "Code",
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).setMark("code").run();
  //   },
  //   icon: RiCodeLine,
  //   shortcut: "`i`",
  // },
  // {
  //   title: "Table",
  //   command: ({ editor, range }) => {
  //     editor
  //       .chain()
  //       .focus()
  //       .deleteRange(range)
  //       .insertTable({ rows: 3, cols: 2, withHeaderRow: false })
  //       .run();
  //   },
  //   icon: AiOutlineTable,
  //   shortcut: "`t`",
  // },
  {
    title: "Bold",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark("bold").run();
    },
    icon: AiOutlineBold,
    shortcut: "**b**",
  },
  {
    title: "Italic",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark("italic").run();
    },
    icon: AiOutlineItalic,
    shortcut: "_i_",
  },
  {
    title: "Underline",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark("underline").run();
    },
    icon: AiOutlineUnderline,
  },
  {
    title: "Strike",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark("strike").run();
    },
    icon: AiOutlineStrikethrough,
    shortcut: "~~s~~",
  },
];

export const suggestions = {
  items: ({ query: q, editor }: { query: string; editor: Editor }) => {
    const query = q.toLowerCase().trim();

    const head = editor.state.selection.$head;
    const parent = head.node(head.depth - 1);

    if (parent.type.name !== "dBlock") return [];

    if (!query) return BlockSelectionItems;

    return BlockSelectionItems.filter((item) =>
      item.title?.toLowerCase().includes(query.toLowerCase())
    );
  },

  render: () => {
    let component: ReactRenderer;
    let localProps: Record<string, any> | undefined;

    return {
      onStart: (props: Record<string, any> | undefined) => {
        localProps = { ...props, event: "" };

        const head = localProps?.editor.state.selection.$head;
        const parent = head.node(head.depth - 1);

        if (parent.type.name !== "dBlock") return;

        component = new ReactRenderer(CommandList, {
          props: localProps,
          editor: localProps?.editor,
        });
      },

      onUpdate(props: Record<string, any> | undefined) {
        component.updateProps(props);
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        component.updateProps({ ...localProps, event: props.event });
        (component.ref as any).onKeyDown({ event: props.event });

        if (props.event.key === "Escape") {
          return true;
        }

        if (props.event.key === "Enter") {
          stopPrevent(props.event);

          return true;
        }

        return false;
      },

      onExit() {
        if (component) {
          component.destroy();
          store.dispatch(setBlockSelectionActive(false));
        }
      },
    };
  },
};
