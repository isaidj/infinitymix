import { Item } from "@/interfaces/Item";
import React, { use, useEffect } from "react";

const ItemCanva = (Item: Item) => {
  useEffect(() => {
    const handleDrag = (event: DragEvent) => {
      event.dataTransfer?.setData("item", Item.id);
      console.log("dragstart", Item.id);
    };
    document.addEventListener("dragstart", handleDrag);
    return () => {
      document.removeEventListener("dragstart", handleDrag);
    };
  }, []);
  return (
    <div
      id={Item.id}
      className="item__canva"
      style={{
        left: `${Item.pos.x}px`,
        top: `${Item.pos.y}px`,
      }}
      draggable
    >
      {Item.name}
    </div>
  );
};

export default ItemCanva;
