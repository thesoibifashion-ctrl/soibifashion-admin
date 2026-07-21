import { Node, mergeAttributes } from "@tiptap/core";

export function getYoutubeEmbedUrl(input: string): string | null {
  const url = input.trim();
  let id: string | null = null;

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      // https://youtu.be/VIDEO_ID
      id = u.pathname.slice(1).split("?")[0];
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/shorts/")) {
        // https://www.youtube.com/shorts/VIDEO_ID
        id = u.pathname.split("/shorts/")[1]?.split("?")[0] ?? null;
      } else if (u.pathname.includes("/embed/")) {
        // already an embed URL
        id = u.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
      } else {
        // https://www.youtube.com/watch?v=VIDEO_ID
        id = u.searchParams.get("v");
      }
    }
  } catch {
    return null;
  }

  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-youtube-embed]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-youtube-embed": "", class: "youtube-embed" }),
      [
        "iframe",
        {
          src: HTMLAttributes.src,
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        },
      ],
    ];
  },
});
