import React from "react";
import Item from "./Item";
const items = [
  { name: "Carro" },
  { name: "Tornado" },
  { name: "Ropa" },
  { name: "Soldado" },
  { name: "Item 5" },
];

const ItemsPanel = () => {
  return (
    <div className="bg-gray-800 w-80  gap-2 p-2 flex flex-wrap" id="items">
      {items.map((item, index) => {
        return <Item key={index} name={item.name} />;
      })}
    </div>
  );
};

export default ItemsPanel;
