import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { store } from "../../../../store";

import { DBlockNodeView } from "./DBlockNodeView";
import { setBlockSelected } from "@/slices/editorSlice";

export interface DBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dBlock: {
      /**
       * Toggle a dBlock
       */
      setDBlock: (position?: number) => ReturnType;
    };
  }
}

export const DBlock = Node.create<DBlockOptions>({
  name: "dBlock",

  priority: 1000,

  group: "dBlock",

  content: "block",

  draggable: true,

  selectable: false,

  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="d-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "d-block" }),
      0,
    ];
  },

  addCommands() {
    return {
      setDBlock:
        (position) =>
        ({ state, chain }) => {
          const {
            selection: { from },
          } = state;

          const pos =
            position !== undefined || position !== null ? from : position;

          return chain()
            .insertContentAt(pos, {
              type: this.name,
              content: [
                {
                  type: "paragraph",
                },
              ],
            })
            .focus(pos + 2)
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DBlockNodeView);
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setDBlock(),
      Enter: ({ editor }) => {
        const {
          selection: { $head, from, to },
          doc,
        } = editor.state;

        if (store.getState().editor.isBlockSelectionActive) {
          store.dispatch(setBlockSelected(true));
          return true;
        }

        const parent = $head.node($head.depth - 1);
        if (parent.type.name !== "dBlock") return false;

        let currentActiveNodeTo = -1;
        let isParagraph = true;

        doc.descendants((node, pos) => {
          if (currentActiveNodeTo !== -1) return false;

          // eslint-disable-next-line consistent-return
          if (node.type.name === this.name) return;

          const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize];

          if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo;

          if (node.type.name != "paragraph" && isParagraph) {
            isParagraph = false;
          }

          return false;
        });

        const content: any[] = doc
          .slice(from, currentActiveNodeTo)
          ?.toJSON().content;

        let modifiedContent = content.map((cnt) => {
          if (cnt.type != "bold" || cnt.type != "paragraph") {
            return {
              ...cnt,
              type: "paragraph",
            };
          }
          return cnt;
        });

        return editor
          .chain()
          .insertContentAt(
            { from, to: currentActiveNodeTo },
            {
              type: this.name,
              content: modifiedContent,
            }
          )
          .focus(from + 4)
          .run();
      },
    };
  },
});
