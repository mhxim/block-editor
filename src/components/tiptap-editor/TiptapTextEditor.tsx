"use client";

/* eslint-disable */
import { EditorContent, Editor, useEditor } from "@tiptap/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import "tippy.js/animations/shift-toward-subtle.css";
// import applyDevTools from "prosemirror-dev-tools";
// import { HocuspocusProvider } from "@hocuspocus/provider";
// import * as Y from "yjs";
import "./styles/tiptap.scss";
import { getBasicExtensions } from "./extensions/basic-extensions";
import { notitapEditorClass } from "./proseClassString";
import CustomBubbleMenu from "./menus/custom-bubble-menu/CustomBubbleMenu";
import { TooltipProvider } from "@ui/Tooltip";

export function DocEditor({
  initialContent,
}: {
  initialContent: any;
}) {
  const logContent = useCallback((e: Editor) => { }, []);
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);
  const openLinkModal = () => setIsAddingNewLink(true);
  const closeLinkModal = () => setIsAddingNewLink(false);

  const editor = useEditor(
    {
      extensions: getBasicExtensions({
        openLinkModal,
      }),
      editorProps: {
        attributes: {
          class: `${notitapEditorClass} focus:outline-none w-full`,
          spellcheck: "false",
          suppressContentEditableWarning: "true",
        },
      },
      onUpdate: debounce(({ editor: e }) => {
        logContent(e);
      }, 500),
    },
    []
  );

  useEffect(() => {
    if (!editor) return;

    editor
      .chain()
      .focus(
        editor.state.doc.childCount > 2 ? editor.state.doc.childCount - 2 : 0
      ).run();
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    if (
      (editor.getText().replace(/\s/g, "") == "" && editor.getJSON().content
        ? editor.getJSON().content!.length <= 3
        : false)
    ) {
      setTimeout(() => {
        editor.commands.setContent(initialContent);
      }, 600);
    }
  }, [editor]);

  return (
    <>
      {
        editor ? <TooltipProvider>
          <section className="flex flex-col gap-2 w-full justify-center">
            <EditorContent
              className="w-full flex justify-center"
              editor={editor}
            />
            <CustomBubbleMenu editor={editor!}></CustomBubbleMenu>
        </section>
        </TooltipProvider> : null
      }

    </>
  );
}
