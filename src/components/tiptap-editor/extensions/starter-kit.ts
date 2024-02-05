import { BulletList } from "@tiptap/extension-bullet-list";
import { AnyExtension, Editor, Extension } from "@tiptap/core";
import Text from "@tiptap/extension-text";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import DropCursor from "@tiptap/extension-dropcursor";
import GapCursor from "@tiptap/extension-gapcursor";
import History from "@tiptap/extension-history";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";

import { Node as ProsemirrorNode } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import { Document } from "./doc";
import { DBlock } from "./dBlock";
import { Paragraph } from "./paragraph";
import { TrailingNode } from "./trailingNode";
import { Commands, suggestions } from "./slash-menu";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Dropdown } from "./dropDown";

export interface PlaceholderOptions {
  emptyEditorClass: string;
  emptyNodeClass: string;
  placeholder:
    | ((PlaceholderProps: {
        editor: Editor;
        node: ProsemirrorNode;
        pos: number;
        hasAnchor: boolean;
      }) => string)
    | string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
  includeChildren: boolean;
}

export const Placeholder = Extension.create<PlaceholderOptions>({
  name: "placeholder",

  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: "Write something …",
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!active) {
              return null;
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isEmpty = !node.isLeaf && !node.childCount;

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass];

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass);
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(" "),
                  "data-placeholder":
                    typeof this.options.placeholder === "function"
                      ? this.options.placeholder({
                          editor: this.editor,
                          node,
                          pos,
                          hasAnchor,
                        })
                      : this.options.placeholder,
                });

                decorations.push(decoration);
              }

              return this.options.includeChildren;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

interface GetExtensionsProps {
  openLinkModal: () => void;
  // provider?: HocuspocusProvider;
  // ydoc: Y.Doc;
  // field: string;
}

export const getExtensions = ({
  openLinkModal,
  // ydoc,
  // provider,
  // field,
}: GetExtensionsProps): AnyExtension[] => {
  return [
    // Necessary
    Document,
    DBlock,
    Paragraph,
    Text,
    DropCursor.configure({
      width: 2,
      class: "notitap-dropcursor w-full ml-[64px]",
      color: "skyblue",
    }),
    GapCursor,
    HardBreak,
    Commands.configure({ suggestions }),

    // marks
    Bold,
    Italic,
    Strike,
    Underline,

    // Node
    ListItem,
    BulletList.extend({
      addKeyboardShortcuts() {
        return {
          Enter: ({ editor }) => {
            
            return false;
          },
        };
      },
    }),
    OrderedList,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Blockquote,
    CodeBlock,
    Code,
    TrailingNode,
    HorizontalRule,

    Placeholder.configure({
      includeChildren: true,
      placeholder: ({ node, editor }) => {
        const {
          selection: { $head, from, to },
          doc,
        } = editor.state;

        const parent = $head.node($head.depth - 1);
        if (parent.type.name !== "dBlock") return "";

        return "Type `/` for commands";
      },
    }),

    // collaboration

    // Collaboration.configure({
    //   document: ydoc,
    //   field,
    // }),
    // CollaborationCursor.configure({
    //   provider,
    //   user: { name: store.getState().user.name },
    // }),
    Dropdown
  ];
};
