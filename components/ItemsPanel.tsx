import React from "react";
import Item from "./Item";
import ItemsContext, { useItemsContext } from "@/context/ItemsContext";

const ItemsPanel = () => {
  const { items } = useItemsContext();

  return (
    <div className="panel__menu__container">
      <div
        className="  gap-2 p-2 flex flex-wrap overflow-y-auto justify-start content-start panel__menu__items"
        id="items"
      >
        {/* <button onClick={() => addItem({ name: "Item" })}>Add Item</button> */}

        {items.map((item, index) => {
          return <Item key={index} name={item.name} type="item__layout" />;
        })}
      </div>
    </div>
  );
};

export default ItemsPanel;
