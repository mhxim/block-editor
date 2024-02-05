import { Editor, isNodeSelection, posToDOMRect } from "@tiptap/react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@ui/Popover";
import ScrollArea from "@ui/ScrollArea";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { store } from "../../../../store";
import { stopPrevent } from "../../utils";
import { selectIsBlockSelected, setBlockSelected, setBlockSelectionActive } from "@/slices/editorSlice";

interface CommandListProps {
  items: any[];
  command: (...args: any[]) => any;
  editor: Editor;
}

export const CommandList = React.forwardRef(
  ({ items, command, editor }: CommandListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [opened, setOpened] = useState<boolean>(false);
    const [pos, setPos] = useState<DOMRect>();
    const isEnterPressed = useSelector(selectIsBlockSelected);

    useEffect(() => {
      const { ranges } = editor.state.selection;
      const from = Math.min(...ranges.map((range) => range.$from.pos));
      const to = Math.max(...ranges.map((range) => range.$to.pos));

      if (isNodeSelection(editor.state.selection)) {
        const node = editor.view.nodeDOM(from) as HTMLElement;

        if (node) {
          setPos(node.getBoundingClientRect());
          return;
        }
      }

      setPos(posToDOMRect(editor.view, from, to));
    }, [editor, editor.state.selection, editor.view]);

    useEffect(() => {
      setSelectedIndex(0);
      setOpened(true);
      store.dispatch(setBlockSelectionActive(true));
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          stopPrevent(event);
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          stopPrevent(event);
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          stopPrevent(event);
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) setTimeout(() => command(item));
      },
      [command, items]
    );

    useEffect(() => {
      if (!isEnterPressed) return;

      selectItem(selectedIndex);
      store.dispatch(setBlockSelectionActive(false));
      store.dispatch(setBlockSelected(false));
      setOpened(false);
    }, [isEnterPressed, selectItem, selectedIndex]);

    useEffect(() => {
      if (!document) return;
      const el = document?.querySelector(`[data-command-item='${"slash-command-item-index-" + selectedIndex}']`)
      if (el) {
        el.scrollIntoView({ block: "nearest" })
      }
    }, [selectedIndex]);

    return (
      <div
        style={{
          position: "fixed",
          top: pos?.top ?? 0,
          left: pos?.left ?? 0,
        }}
      >
        <Popover
          open={opened}
          onOpenChange={(v) => {
            setOpened(v);
            if (!v) {
              store.dispatch(setBlockSelectionActive(false));
            }
          }}
          modal={false}
        >
          <PopoverAnchor></PopoverAnchor>
          <PopoverContent
            zIndex={9999}
            isOpen={opened}
            onOpenAutoFocus={(e) => e.preventDefault()}
            side={"bottom"}
            align="start"
            sideOffset={30}
            avoidCollisions={true}
            collisionPadding={4}
            style={{
              position: "fixed",
              top:
                (pos?.top ?? 0) <
                document.body.getBoundingClientRect().bottom - 350
                  ? pos?.top
                  : (pos?.top ?? 0) - 350,
              left: pos?.left ?? 0,
              height: "300px",
              display: "flex",
              alignItems:
                (pos?.top ?? 0) <
                document.body.getBoundingClientRect().bottom - 350
                  ? "start"
                  : "end",
            }}
          >
            <ScrollArea>
              <div className="flex flex-col min-w-[20rem] max-h-[300px]">
                {items.length ? (
                  <div className="flex flex-col">
                    <div className="text-gray-600 my-1 text-sm px-2">
                      Blocks
                    </div>
                    {items.map((item, index) => {
                      return (
                        <button
                          type="button"
                          className={`flex flex-row items-center justify-between hover:bg-gray-100 py-1 pl-2 pr-4 rounded ${
                            index === selectedIndex ? "bg-gray-100" : ""
                          }  `}
                          key={item.title}
                          onClick={() => selectItem(index)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onKeyDown={(e) =>
                            e.code === "Enter" && selectItem(index)
                          }
                          data-command-item={
                            "slash-command-item-index-" + index
                          }
                        >
                          <span className="flex flex-row items-center gap-2">
                            <span className="h-8 w-8 flex items-center justify-center border border-slate-400 bg-white rounded">
                              <item.icon />
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item.title,
                              }}
                              className="text-gray-800 text-sm"
                              suppressContentEditableWarning={true}
                            />
                          </span>
                          {item.shortcut && (
                            <code className="text-xs text-gray-600">
                              {item.shortcut}
                            </code>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 px-2">No result</div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

CommandList.displayName = "";
