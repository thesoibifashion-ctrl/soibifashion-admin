import { Node, mergeAttributes } from "@tiptap/core";

export const Audio = Node.create({
  name: "audio",

  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      type: {
        default: "audio/mpeg",
      },
      controls: {
        default: true,
      },
      class: {
        default: "w-full my-3 rounded-md border border-gray-300 bg-gray-50 p-2",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "audio[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "audio",
      mergeAttributes(HTMLAttributes, { controls: true }),
      ["source", { src: HTMLAttributes.src, type: HTMLAttributes.type }],
      "Your browser does not support the audio element.",
    ];
  },
});
