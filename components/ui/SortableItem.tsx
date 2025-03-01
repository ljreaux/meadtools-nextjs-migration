"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex my-2 ${isDragging ? "border border-muted-foreground" : "border-0"} border-collapse rounded-md overflow-clip bg-background`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="grid items-center justify-center bg-muted-foreground mr-2 "
        style={{ touchAction: "none" }}
      >
        <GripVertical className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
      {/* Item content */}
      <div className="mr-2 flex-1">{children}</div>
    </div>
  );
}
