import { Button } from "@/components/ui/button";
import { Heading1, Heading2, Heading3, Heading4, Heading5 } from "lucide-react";
import video from "@/assets/images/icons/blog/vid.svg";
import audio from "@/assets/images/icons/blog/audio.svg";
import bold from "@/assets/images/icons/blog/bold.svg";
import bullet from "@/assets/images/icons/blog/bullet.svg";
import image from "@/assets/images/icons/blog/image.svg";
import italic from "@/assets/images/icons/blog/italic.svg";
import number from "@/assets/images/icons/blog/number.svg";
import strike from "@/assets/images/icons/blog/strike.svg";
import underline from "@/assets/images/icons/blog/underline.svg";
import links from "@/assets/images/icons/blog/link.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Level } from "@tiptap/extension-heading";
import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
  onLinkClick: () => void;
  onImageClick: () => void;
  onAudioClick: () => void;
  onVideoClick: () => void;
}

export function EditorToolbar({
  editor,
  onLinkClick,
  onImageClick,
  onAudioClick,
  onVideoClick,
}: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {/* Heading Dropdown */}
      <Select
        onValueChange={(value) => {
          const level = Number(value) as Level;
          editor.chain().focus().toggleHeading({ level }).run();
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Normal text" />
        </SelectTrigger>
        <SelectContent>
          {[
            { level: 1, icon: <Heading1 className="w-4 h-4" /> },
            { level: 2, icon: <Heading2 className="w-4 h-4" /> },
            { level: 3, icon: <Heading3 className="w-4 h-4" /> },
            { level: 4, icon: <Heading4 className="w-4 h-4" /> },
            { level: 5, icon: <Heading5 className="w-4 h-4" /> },
          ].map(({ level, icon }) => (
            <SelectItem key={level} value={String(level)}>
              <div className="flex items-center gap-2">
                {icon}
                <span>Heading {level}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Bold / Italic / Underline / Strike */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-0 py-0"
        >
          <img src={bold} alt="Bold" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-0 py-0"
        >
          <img src={italic} alt="Italic" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-0 py-0"
        >
          <img src={underline} alt="Underline" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="px-0 py-0"
        >
          <img src={strike} alt="Strike" className="w-5 h-5" />
        </Button>
      </div>

      {/* Link / Media */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLinkClick}
          className="px-0 py-0"
        >
          <img src={links} alt="Link" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onImageClick}
        >
          <img src={image} alt="Image" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onAudioClick}
        >
          <img src={audio} alt="Audio" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onVideoClick}
        >
          <img src={video} alt="Video" className="w-5 h-5" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <img src={bullet} alt="Bullet list" className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <img src={number} alt="Numbered list" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}