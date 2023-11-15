import React, {
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useRef,
    useLayoutEffect,
} from "react";
import { Editor, Range, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { LuBold as Bold,
    LuHeading1 as Heading1,
    LuHeading2 as Heading2,
    LuHeading3 as Heading3,
    LuItalic as Italic,
    LuList as List,
    LuListOrdered as ListOrdered,
    LuCheckSquare,
    LuCode,
    LuImage,
    LuTextQuote,
    LuMessageSquarePlus as MessageSquarePlus,
    LuText as Text
} from "react-icons/lu";
import { startImageUpload } from "../plugins/upload-images";


interface CommandItemProps {
    title: string;
    description: string;
    icon: ReactNode;
}

interface CommandProps {
    editor: Editor;
    range: Range;
}

const Command = Extension.create({
    name: "slash-command",
    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: Editor;
                    range: Range;
                    props: any;
                }) => {
                    props.command({ editor, range });
                },
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: "Send Feedback",
            description: "Let us know how we can improve.",
            icon: <MessageSquarePlus size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor.chain().focus().deleteRange(range).run();
              window.open("/feedback", "_blank");
            },
          },
          {
            title: "Text",
            description: "Just start typing with plain text.",
            searchTerms: ["p", "paragraph"],
            icon: <Text size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .run();
            },
          },
          {
            title: "To-do List",
            description: "Track tasks with a to-do list.",
            searchTerms: ["todo", "task", "list", "check", "checkbox"],
            icon: <LuCheckSquare size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
          },
          {
            title: "Heading 1",
            description: "Big section heading.",
            searchTerms: ["title", "big", "large"],
            icon: <Heading1 size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
            },
          },
          {
            title: "Heading 2",
            description: "Medium section heading.",
            searchTerms: ["subtitle", "medium"],
            icon: <Heading2 size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
            },
          },
          {
            title: "Heading 3",
            description: "Small section heading.",
            searchTerms: ["subtitle", "small"],
            icon: <Heading3 size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
            },
          },
          {
            title: "Bullet List",
            description: "Create a simple bullet list.",
            searchTerms: ["unordered", "point"],
            icon: <List size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
          },
          {
            title: "Numbered List",
            description: "Create a list with numbering.",
            searchTerms: ["ordered"],
            icon: <ListOrdered size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
          },
          {
            title: "Quote",
            description: "Capture a quote.",
            searchTerms: ["blockquote"],
            icon: <LuTextQuote size={18} />,
            command: ({ editor, range }: CommandProps) =>
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .toggleBlockquote()
                .run(),
          },
          {
            title: "Code",
            description: "Capture a code snippet.",
            searchTerms: ["codeblock"],
            icon: <LuCode size={18} />,
            command: ({ editor, range }: CommandProps) =>
              editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
          },
          {
            title: "Image",
            description: "Upload an image from your computer.",
            searchTerms: ["photo", "picture", "media"],
            icon: <LuImage size={18} />,
            command: ({ editor, range }: CommandProps) => {
              editor.chain().focus().deleteRange(range).run();
              // upload image
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                if (input.files?.length) {
                  const file = input.files[0];
                  const pos = editor.view.state.selection.from;
                  startImageUpload(file, editor.view, pos);
                }
              };
              input.click();
            },
          },
    ].filter((item) => {
        if (typeof query === "string" && query.length > 0) {
            return item.title.toLowerCase().includes(query.toLowerCase());
        }
        return true;
    });
    // .slice(0, 10);
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
    const containerHeight = container.offsetHeight;
    const itemHeight = item ? item.offsetHeight : 0;

    const top = item.offsetTop;
    const bottom = top + itemHeight;

    if (top < container.scrollTop) {
        container.scrollTop -= container.scrollTop - top + 5;
    } else if (bottom > containerHeight + container.scrollTop) {
        container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
    }
};

const CommandList = ({
    items,
    command,
}: {
    items: CommandItemProps[];
    command: any;
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const commandListContainer = useRef<HTMLDivElement>(null);
    const selectedButtonRef = useRef<HTMLButtonElement>(null);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                command(item);
            }
        },
        [command, items]
    );

    useEffect(() => {
        const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
        const onKeyDown = (e: KeyboardEvent) => {
            if (navigationKeys.includes(e.key)) {
                e.preventDefault();
                if (e.key === "ArrowUp") {
                    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                    return true;
                }
                if (e.key === "ArrowDown") {
                    setSelectedIndex((selectedIndex + 1) % items.length);
                    return true;
                }
                if (e.key === "Enter") {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [items, selectedIndex, setSelectedIndex, selectItem]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
        const container = commandListContainer.current;
        const item = selectedButtonRef.current;

        if (item && container) {
            container.scrollTop = item.offsetTop - container.offsetTop;

            item.focus();
        }

        if (selectedIndex === 0 && items.length > 0) {
            setTimeout(() => {
                selectedButtonRef.current?.focus();
            }, 10);
        }
    }, [selectedIndex, items]);

    return items.length > 0 ? (
        <div
            ref={commandListContainer}
            className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border border-gray-200 bg-white px-1 py-2 shadow-md transition-all"
        >
            {items.map((item: CommandItemProps, index: number) => {
                const isSelected = index === selectedIndex;
                return (
                    <button
                        ref={isSelected ? selectedButtonRef : null}
                        className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 ${isSelected ? "bg-gray-100 text-gray-900" : ""
                            }`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                            {item.icon}
                        </div>
                        <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    ) : null;
};

const renderItems = () => {
    let component: ReactRenderer | null = null;
    let popup: any | null = null;

    return {
        onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            // @ts-ignore
            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
            });
        },
        onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
            component?.updateProps(props);

            popup &&
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
        },
        onKeyDown: (props: { event: KeyboardEvent }) => {
            if (props.event.key === "Escape") {
                popup?.[0].hide();

                return true;
            }

            // @ts-ignore
            return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
            popup?.[0].destroy();
            component?.destroy();
        },
    };
};

const SlashCommand = Command.configure({
    suggestion: {
        items: getSuggestionItems,
        render: renderItems,
    },
});

export default SlashCommand;
