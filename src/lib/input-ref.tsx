import { useRef } from "react";

const fileInputRef = useRef<HTMLInputElement>(null);

export const openFilePicker = () => {
  fileInputRef.current?.click();
};