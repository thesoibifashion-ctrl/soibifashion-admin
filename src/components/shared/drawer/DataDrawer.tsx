"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  width?:string
}

export function 
AppDrawer({
  open,
  onOpenChange,
  title,
  width = "w-[60%] lg:max-w-[40%]!",
  children,
}: AppDrawerProps) {
  return (
    <Drawer open={open} direction="right" onOpenChange={onOpenChange}>
      <DrawerContent className={`px-6  pb-6 ${width}`}>
        <div className="mx-auto overflow-y-auto w-full max-w-full">
          {title && (
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-xl">{title}</DrawerTitle>
            </DrawerHeader>
          )}

          {children} 
        </div>
      </DrawerContent>
    </Drawer>
  );
}