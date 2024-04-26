"use client";
import React, { useEffect, useRef } from "react";

interface ItemProps {
  name: string;
}
const Item = (ItemProps: ItemProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.addEventListener("dragstart", (event) => {
      const target = event.target as HTMLElement;
      event.dataTransfer?.setData("item", target.id);
      target.style.opacity = "0.5";
    });
    document.addEventListener("dragend", (event) => {
      const target = event.target as HTMLElement;
      target.style.opacity = "1";
    });

    document.addEventListener("dragenter", (event) => {
      const target = event.target as HTMLElement;
      //solo se aplica el efecto si el tiene un padre con la clase item-container
      if (
        target.classList.contains("item") &&
        target.parentElement?.classList.contains("item-container")
      ) {
        target.classList.add("item__hovered");
        // console.log("dragenter");
      }
    });
    document.addEventListener("dragleave", (event) => {
      const target = event.target as HTMLElement;
      //solo se aplica el efecto si el tiene un padre con la clase item-container
      if (
        target.classList.contains("item") &&
        target.parentElement?.classList.contains("item-container")
      ) {
        target.classList.remove("item__hovered");
        // console.log("dragleave");
      }
    });
  }, []);

  return (
    <div
      ref={divRef}
      id={ItemProps.name}
      className="bg-gray-700 text-white border border-gray-600 rounded-sm  text-center w-auto h-fit py-1 px-2 text-nowrap item new-item"
      draggable="true"
    >
      {ItemProps.name}
    </div>
  );
};

export default Item;
