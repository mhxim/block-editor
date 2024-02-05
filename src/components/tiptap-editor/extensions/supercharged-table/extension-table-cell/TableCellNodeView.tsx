/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useEffect, useRef, useState } from "react";
import { NodeViewContent, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import Tippy from '@tippyjs/react';

import "./styles.scss";
import { CgChevronDown, CgClose } from "react-icons/cg";
import { IconType } from "react-icons";
import { AiOutlineDeleteColumn, AiOutlineDeleteRow, AiOutlineInsertRowAbove, AiOutlineInsertRowBelow, AiOutlineInsertRowLeft, AiOutlineInsertRowRight } from "react-icons/ai";
import { RiSideBarFill, RiTableFill } from "react-icons/ri";
import { BsBorderOuter } from "react-icons/bs";

interface CellButton {
  name: string;
  action: (editor: Editor) => boolean;
  icon: IconType;
}

const cellButtonsConfig: CellButton[] = [
  {
    name: "Add row above",
    action: (editor) => editor.chain().focus().addRowBefore().run(),
    icon: AiOutlineInsertRowAbove,
  },
  {
    name: "Add row below",
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    icon: AiOutlineInsertRowBelow,
  },
  {
    name: "Add column before",
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
    icon: AiOutlineInsertRowLeft,
  },
  {
    name: "Add column after",
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    icon: AiOutlineInsertRowRight,
  },
  {
    name: "Remove row",
    action: (editor) => editor.chain().focus().deleteRow().run(),
    icon: AiOutlineDeleteRow,
  },
  {
    name: "Remove col",
    action: (editor) => editor.chain().focus().deleteColumn().run(),
    icon: AiOutlineDeleteColumn,
  },
  {
    name: "Toggle header row",
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
    icon: RiTableFill
  },
  {
    name: "Toggle header column",
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
    icon: RiSideBarFill,
  },
  {
    name: "Toggle header cell",
    action: (editor) => editor.chain().focus().toggleHeaderCell().run(),
    icon: BsBorderOuter,
  },
  {
    name: "Remove table",
    action: (editor) => editor.chain().focus().deleteTable().run(),
    icon: CgClose,
  },
];

export const TableCellNodeView: FC<NodeViewProps> = ({
  node,
  getPos,
  selected,
  editor,
}) => {
  const [isCurrentCellActive, setIsCurrentCellActive] = useState(false);

  const tableCellOptionsButtonRef = useRef<HTMLLabelElement>(null);

  const calculateActiveSateOfCurrentCell = () => {
    const { from, to } = editor.state.selection;

    const nodeFrom = getPos();
    const nodeTo = nodeFrom + node.nodeSize;

    setIsCurrentCellActive(nodeFrom <= from && to <= nodeTo);
  };

  useEffect(() => {
    editor.on("selectionUpdate", calculateActiveSateOfCurrentCell);

    setTimeout(calculateActiveSateOfCurrentCell, 100);

    return () => {
      editor.off("selectionUpdate", calculateActiveSateOfCurrentCell);
    };
  });

  const gimmeDropdownStyles = (): React.CSSProperties => {
    let top = tableCellOptionsButtonRef.current?.clientTop;
    if (top) top += 5;

    let left = tableCellOptionsButtonRef.current?.clientLeft;
    if (left) left += 5;

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <NodeViewWrapper>
      <NodeViewContent as="span" />

      {(isCurrentCellActive || selected) && (
        <Tippy
          appendTo={document.body}
          trigger="click"
          interactive
          animation="shift-toward-subtle"
          placement="right-start"
          content={
            <article className="dropdown" contentEditable={false}>
              <ul
                tabIndex={0}
                className="dropdown-content fixed menu menu-compact p-2 shadow bg-gray-100 rounded w-56"
                style={gimmeDropdownStyles()}
              >
                {cellButtonsConfig.map((btn) => {
                  return (
                    <li key={btn.name}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => btn.action(editor)}
                      >
                        <span>
                          <btn.icon></btn.icon>
                        </span>

                        <span>{btn.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          }
        >
          <label
            tabIndex={0}
            className="absolute top-0 right-0 p-1 m-1 hover:bg-gray-200 rounded"
            contentEditable={false}
          >
            <CgChevronDown className="text-gray-700"/>
          </label>
        </Tippy>
      )}
    </NodeViewWrapper>
  );
};
