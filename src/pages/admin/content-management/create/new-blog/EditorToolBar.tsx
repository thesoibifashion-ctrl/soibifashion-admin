import { Button } from "@/components/ui/button";
import { Heading1, Heading2, Heading3 } from "lucide-react";
import video from "@/assets/images/blog/vid.svg";
import audio from "@/assets/images/blog/audio.svg";
import bold from "@/assets/images/blog/bold.svg";
import bullet from "@/assets/images/blog/bullet.svg";
import image from "@/assets/images/blog/image.svg";
import italic from "@/assets/images/blog/italic.svg";
import number from "@/assets/images/blog/number.svg";
import strike from "@/assets/images/blog/strike.svg";
import underline from "@/assets/images/blog/underline.svg";
import links from "@/assets/images/blog/link.svg";
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
    <div className="flex flex-wrap justify-center bg-white rounded-b-lg pb-2">
      <div className="py-2 border-r flex items-center px-4 border-[#D7D7D7]">
        <Select
          onValueChange={(value) => {
            const level = Number(value) as Level;
            editor.chain().focus().toggleHeading({ level }).run();
          }}
        >
          <SelectTrigger className="bg-[#F9F9F9] rounded-[6px] border-none text-[13px] text-[#2D2B2B] font-normal">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            {[
              { level: 1, icon: <Heading1 size={16} /> },
              { level: 2, icon: <Heading2 size={16} /> },
              { level: 3, icon: <Heading3 size={16} /> },
              // { level: 4, icon: <Heading4 size={16} /> },
              // { level: 5, icon: <Heading5 size={16} /> },
            ].map(({ level, icon }) => (
              <SelectItem
                key={level}
                value={String(level)}
                className="flex items-center gap-2"
              >
                {icon}
                <span>Heading {level}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-[13px] px-4 py-[15.5px] border-r border-[#D7D7D7]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-0 py-0"
        >
          <img src={bold} alt="bold" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-0 py-0"
        >
          <img src={italic} alt="italic" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-0 py-0"
        >
          <img src={underline} alt="underline" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="px-0 py-0"
        >
          <img src={strike} alt="strike" />
        </Button>
      </div>

      <div className="flex items-center gap-[13px] px-4 py-[15.5px] border-r border-[#D7D7D7]">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLinkClick}
          className="px-0 py-0"
        >
          <img src={links} alt="link" />
        </Button>

        <div className="cursor-pointer" onClick={onImageClick}>
          <img src={image} alt="image" />
        </div>

        <div className="cursor-pointer" onClick={onAudioClick}>
          <img src={audio} alt="audio" />
        </div>

        <div className="cursor-pointer" onClick={onVideoClick}>
          <img src={video} alt="video" />
        </div>
      </div>

      <div className="flex items-center gap-[13px] px-4 py-[15.5px]">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 py-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <img src={bullet} alt="bullet" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <img src={number} alt="number" />
        </Button>
      </div>
    </div>
  );
}