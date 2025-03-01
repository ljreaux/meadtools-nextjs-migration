"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

export default function DragList<T extends { id: string }>({
  items,
  setItems,
  renderItem,
}: {
  items: T[];
  setItems: (arr: T[]) => void;
  renderItem?: (item: T) => React.ReactNode;
}) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {renderItem ? renderItem(item) : String(item.id)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
