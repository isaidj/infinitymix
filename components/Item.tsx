"use client";
import React, { useEffect, useRef } from "react";

interface ItemProps {
  name: string;
  type: "item__mixer" | "item__layout";
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
    // si se suelta en el mixer se elimina el item


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
      className={`item new-item ${ItemProps.type}`}
      draggable
    >
      {ItemProps.name}
    </div>
  );
};

export default Item;
