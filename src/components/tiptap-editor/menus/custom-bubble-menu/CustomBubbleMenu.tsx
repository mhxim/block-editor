import { isNodeSelection, isTextSelection, posToDOMRect } from "@tiptap/core";
import { Popover, PopoverContent, PopoverAnchor } from "@ui/Popover";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { generalButtons } from "./buttons";
import { Editor } from "@tiptap/react";
import { Dropdown, DropdownContent, DropdownTrigger } from "@ui/Dropdown";
import { CgChevronDown } from "react-icons/cg";
import { BlockSelectionContent } from "./BlockSelectionContent";
import { EditorView } from "@tiptap/pm/view";
import { EditorState } from "@tiptap/pm/state";
import { Tooltip } from "@ui/Tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

type Props = {
  editor: Editor;
};

export default function CustomBubbleMenu({ editor }: Props) {
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const [isBlockSelectionOpen, setIsBlockSelectionOpen] =
    useState<boolean>(false);

  const buttonText = () => {
    if (editor.isActive("heading", { level: 1 })) {
      return "Heading 1";
    }
    if (editor.isActive("heading", { level: 2 })) {
      return "Heading 2";
    }
    if (editor.isActive("heading", { level: 3 })) {
      return "Heading 3";
    }
    if (editor.isActive("orderedList")) {
      return "Numbered list";
    }
    if (editor.isActive("bulletList")) {
      return "Bulleted list";
    }

    return "Normal text";
  };

  const shouldShow = ({
    view,
    state,
    from,
    to,
  }: {
    view: EditorView;
    state: EditorState;
    from: number;
    to: number;
  }) => {
    const { doc, selection } = state;
    const { empty } = selection;

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock =
      !doc.textBetween(from, to).length && isTextSelection(state.selection);

    if (!view.hasFocus() || empty || isEmptyTextBlock) return false;

    return true;
  };

  useEffect(() => {
    const { view } = editor;
    const { state, composing } = view;
    const { doc, selection } = state;
    // const isSame =
    //   oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);
    if (composing || isBlockSelectionOpen) {
      return;
    }
    // if (composing || isSame) return;

    // support for CellSelections
    const { ranges } = selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    const shouldOpen = shouldShow({
      view,
      state,
      from,
      to,
    });

    if (!shouldOpen) {
      setOpen(false);
      return;
    }

    let pos = new DOMRect();
    if (isNodeSelection(editor.state.selection)) {
      const node = editor.view.nodeDOM(from) as HTMLElement;

      if (node) {
        pos = node.getBoundingClientRect();
        return;
      }
    }

    pos = posToDOMRect(editor.view, from, to);

    setLeft(pos.left ?? 0);
    setTop(pos.top ?? 0);
    setOpen(true);
  }, [
    editor,
    editor.state.selection,
    editor.view,
    editor.state.selection.from,
    editor.state.selection.to,
    isBlockSelectionOpen,
  ]);

  return (
    <Popover open={open} modal={false}>
      <Dropdown
        open={isBlockSelectionOpen}
        onOpenChange={(v) => setIsBlockSelectionOpen(v)}
      >
        <PopoverAnchor
          style={{ position: "fixed", top: top - 36, left }}
        ></PopoverAnchor>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e: any) =>
            e.target?.editor ? null : setOpen(false)
          }
          isOpen={open}
          side="top"
          align="start"
          alignOffset={-20}
          zIndex={999}
          padding={0}
          exitDuration={0}
        >
          <Toolbar.Root className="flex flex-row flowy-editor-toolbar">
            <Tooltip
              content={<div className="text-sm">Turn into</div>}
              disableHoverableContent={true}
              delayDuration={400}
            >
              <TooltipTrigger asChild>
                <Toolbar.Button asChild>
                  <DropdownTrigger
                    onClick={() => setIsBlockSelectionOpen(true)}
                    className="flex flex-row gap-1 items-center px-2 hover:bg-gray-100 focus:bg-gray-100 text-sm text-gray-700"
                  >
                    {buttonText()}
                    <CgChevronDown size={18} />
                  </DropdownTrigger>
                </Toolbar.Button>
              </TooltipTrigger>
            </Tooltip>
            {generalButtons.map((btn) => {
              return (
                <Tooltip
                  key={btn.tooltip}
                  content={<div className="text-sm">{btn.tooltip}</div>}
                  disableHoverableContent={true}
                  delayDuration={400}
                >
                  <TooltipTrigger asChild>
                    <Toolbar.Button
                      type="button"
                      className={`p-2 hover:bg-gray-200 text-gray-700 ${
                        btn.isActive(editor) ? "bg-gray-100" : ""
                      }`}
                      onClick={(e) => btn.action(editor)}
                    >
                      {<btn.Icon />}
                    </Toolbar.Button>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
          </Toolbar.Root>
          <DropdownContent
            side="bottom"
            align="center"
            isOpen={isBlockSelectionOpen}
            zIndex={999}
          >
            <BlockSelectionContent editor={editor} />
          </DropdownContent>
        </PopoverContent>
      </Dropdown>
    </Popover>
  );
}
