import React from "react";
import Item from "./Item";
import ItemsContext, { useItemsContext } from "@/context/ItemsContext";

const ItemsPanel = () => {
  const { items } = useItemsContext();

  return (
    <div
      className="bg-gray-800 w-80 h-screen   gap-2 p-2 flex flex-wrap overflow-y-auto justify-start content-start "
      id="items"
    >
      {/* <button onClick={() => addItem({ name: "Item" })}>Add Item</button> */}

      {items.map((item, index) => {
        return <Item key={index} name={item.name} />;
      })}
    </div>
  );
};

export default ItemsPanel;
