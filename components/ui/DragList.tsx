"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

export default function DragList<T extends { id: string }>({
  items,
  setItems,
  renderItem,
}: {
  items: T[];
  setItems: (arr: T[]) => void;
  renderItem?: (item: T, i: number) => React.ReactNode;
}) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Configure appropriate sensors based on device type
  const sensors = useSensors(
    // For desktop: regular pointer sensor with no delay
    useSensor(PointerSensor, {
      // Only activate for non-touch interactions (mouse)
      activationConstraint: isTouchDevice
        ? {
            distance: 10, // Requires some movement to distinguish from clicks
          }
        : undefined,
    }),
    // For mobile/touch: dedicated touch sensor with delay
    useSensor(TouchSensor, {
      // Only activate for touch interactions with delay
      activationConstraint: {
        delay: 350, // 250ms delay before dragging starts
        tolerance: 8, // Allow slight movement for better scrolling
      },
    }),
    // Keyboard sensor for accessibility
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      setItems(newItems);
    }
  };

  const itemIds = items.map((item) => item.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={item.id} id={item.id}>
            {renderItem ? renderItem(item, i) : String(item.id)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
