/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useMemo, useState } from "react";
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";
import { MdAdd, MdDragIndicator } from "react-icons/md";
import { motion } from "framer-motion";
import { store } from "../../../../store";
import * as Popover from "@radix-ui/react-popover";
import { setBlockSelectionActive } from "@/slices/editorSlice";

export const DBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
}) => {
  const [hovered, setHovered] = useState(false);
  const isTable = useMemo(() => {
    const { content } = node.content as any;

    return content[0].type.name === "table";
  }, [node.content]);

  const createNodeAfter = () => {
    const pos = getPos() + node.nodeSize;

    editor.commands.insertContentAt(pos, {
      type: "dBlock",
      content: [
        {
          type: "paragraph",
        },
      ],
    });

    editor.commands.focus(pos + 1);
    store.dispatch(setBlockSelectionActive(true));
  };

  return (
    <NodeViewWrapper
      as={motion.div}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex gap-[8px] group w-full relative"
    >
      <section
        className={`flex flex-row gap-1 ${hovered ? "" : "opacity-0"}`}
        aria-label="left-menu"
        contentEditable="false"
        suppressContentEditableWarning={true}
      >
        <div>
          <button
            type="button"
            className="p-1 hover:bg-gray-200 text-gray-500 select-none"
            onClick={createNodeAfter}
          >
            <MdAdd size={18} />
          </button>
        </div>
        <div>
          <div
            className="p-1 hover:bg-gray-200 cursor-pointer text-gray-500 select-none"
            contentEditable={false}
            draggable
            data-drag-handle
          >
            <MdDragIndicator size={18} />
          </div>
        </div>
      </section>
      <NodeViewContent className={`node-view-content w-full`} />
    </NodeViewWrapper>
  );
};
