import { Node, mergeAttributes } from "@tiptap/core";

export const Video = Node.create({
  name: "video",

  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      type: { default: "video/mp4" },
      controls: { default: true },
      class: { default: "w-full my-3 rounded-md" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, { controls: true }),
      ["source", { src: HTMLAttributes.src, type: HTMLAttributes.type }],
      "Your browser does not support the video element.",
    ];
  },
});
