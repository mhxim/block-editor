import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useEffect, useRef } from "react";
import * as Switch from "@radix-ui/react-switch";

import "./styles.scss";
import Button from "@ui/Button";
import { FiPlus, FiTrash, FiTrash2, FiX } from "react-icons/fi";

export const DropDownNodeView = ({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) => {
  const updateQuestion = (value: string) => {
    updateAttributes({
      question: value,
    });
  };

  const updateOptionValue = (index: number, value: string) => {
    const updatedOptions = [...node.attrs.options];
    updatedOptions[index] = { value, tags: updatedOptions[index].tags };
    updateAttributes({
      options: updatedOptions,
    });
  };

  const updateOptionTags = (index: number, value: string) => {
    const updatedOptions = [...node.attrs.options];
    updatedOptions[index] = { value: updatedOptions[index].value, tags: [value] };
    updateAttributes({
      options: updatedOptions,
    });
  };

  const addItem = (value: string) => {
    updateAttributes({
      options: [...node.attrs.options, { value, tags: [] }],
    });
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...node.attrs.options];
    updatedOptions.splice(index, 1);
    updateAttributes({
      options: updatedOptions,
    });
  };

  const handleOptionFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const handleInputBlur = (
    index: number,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.trim();
    if (value === "") {
      const updatedOptions: { value: string; tags: string[] }[] = [
        ...node.attrs.options,
      ];

      updatedOptions[index] = {
        value: `Option ${index + 1}`,
        tags: updatedOptions[index].tags,
      };
      updateAttributes({
        options: updatedOptions,
      });
      return;
    }

    let updatedOptions: { value: string; tags: string[] }[] = [];
    node.attrs.options.forEach(
      (opt: { value: string; tags: string[] }, i: number) => {
        if (
          [
            ...updatedOptions,
            ...node.attrs.options.slice(updatedOptions.length),
          ].filter(
            (o: { value: string; tags: string[] }) => o.value == opt.value
          ).length > 1
        ) {
          updatedOptions.push({ value: `Option ${i + 1}`, tags: opt.tags });
        } else {
          updatedOptions.push(opt);
        }
      }
    );

    updateAttributes({
      options: [...updatedOptions],
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleAddOptionClick = () => {
    const index = node.attrs.options.length + 1;
    const value = `Option ${index}`;
    addItem(value);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  useEffect(() => {}, [node.attrs.options]);

  return (
    <NodeViewWrapper className="border rounded-lg mb-2">
      <div className="flex flex-col p-4">
        <div className="text-normal-500 text-sm">Drop-down</div>
        <input
          className="w-full focus:outline-none text-xl font-medium"
          placeholder="Question"
          onChange={(e) => updateQuestion(e.target.value)}
          defaultValue={node.attrs.question}
        />
        <ol className="w-full flex flex-col gap-1">
          {node.attrs.options.map(
            (option: { value: string; tags: string[] }, i: number) => {
              return (
                <li key={i}>
                  <div className="flex flex-row">
                    <input
                      className="w-full focus:outline-none"
                      ref={node.attrs.options.length - 1 == i ? inputRef : null}
                      value={option.value}
                      onFocus={handleOptionFocus}
                      onBlur={(e) => handleInputBlur(i, e)}
                      onInput={(e) => updateOptionValue(i, e.currentTarget.value)}
                    />
                    <input
                      className="w-full focus:outline-none"
                      value={option.tags.length ? option.tags[0] : ""}
                      placeholder="Tag"
                      onBlur={(e) => handleInputBlur(i, e)}
                      onInput={(e) => updateOptionTags(i, e.currentTarget.value)}
                    />
                    {node.attrs.options.length > 1 && (
                      <button
                        className="ml-2 p-2 rounded"
                        onClick={() => removeOption(i)}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </li>
              );
            }
          )}
          <li>
            <Button intent={"secondary"} onClick={handleAddOptionClick}>
              Add option
            </Button>
          </li>
        </ol>
      </div>
      <div className="flex flex-row justify-between align-center border-t border-normal-50 p-4">
        <div className="flex items-center">
          <label
            className="text-lead-900 text-[15px] leading-none pr-[15px]"
            onClick={() => switchRef.current?.click()}
          >
            Apply Tags in Ticket
          </label>
          <Switch.Root
            ref={switchRef}
            checked={node.attrs.settings.applyTags}
            onCheckedChange={(v) =>
              updateAttributes({
                settings: { ...node.attrs.settings, applyTags: v },
              })
            }
            className="w-[42px] h-[24px] bg-normal-100 rounded-full data-[state=checked]:bg-loud-900 outline-none cursor-default"
          >
            <Switch.Thumb className="block w-[18px] h-[18px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
        <button onClick={deleteNode}>
          <FiTrash2 size={18} />
        </button>
      </div>
    </NodeViewWrapper>
  );
};
