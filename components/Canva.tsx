import React, { use, useEffect } from "react";
import ItemCanva from "./ItemCanva";
import { Item, position } from "@/interfaces/Item";
import axios from "axios";

const initialItems: Item[] = [
  { id: "1", pos: { x: 100, y: 100 }, name: "Item 1" },
  { id: "2", pos: { x: 200, y: 200 }, name: "Item 2" },
  { id: "3", pos: { x: 300, y: 300 }, name: "Item 3" },
  { id: "4", pos: { x: 400, y: 400 }, name: "Item 4" },
  { id: "5", pos: { x: 500, y: 500 }, name: "Item 5" },
  { id: "6", pos: { x: 600, y: 600 }, name: "Item 6" },
  { id: "7", pos: { x: 700, y: 700 }, name: "Item 7" },
];
const Canva = () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [itemsCanva, setItemsCanva] = React.useState<Item[]>(initialItems);

  const createItem = (item: Item) => {
    console.log("item a crear", item);
    setItemsCanva((prevItems) => [
      ...prevItems,
      { id: item.id, pos: item.pos, name: `Item ${item.id}` },
    ]);
  };
  const deleteItem = (id: string | number) => {
    setItemsCanva((prevItems) => prevItems.filter((item) => item.id != id));
  };
  const moveItem = (idItem: string, newPosition: position) => {
    setItemsCanva((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === idItem ? { ...prevItem, pos: newPosition } : prevItem
      )
    );
  };
  const fetchFuse = async ({ words }: { words: string[] }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.79:3000/api/infinity",
        {
          words: words,
        }
      );
      const data: string = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const fuse = async (
    items: HTMLElement[],
    x: number, //posicion del mouse en x
    y: number //posicion del mouse en y
  ) => {
    const itemsCanvaLength = itemsCanva.length; //guardamos la longitud de los items
    const items_id = items.map((item) => item.id);
    const words: string[] = items_id.map(
      (id) => itemsCanva.find((item) => item.id === id)?.name || ""
    );
    console.log(words);
    //se eliminan los items que se van a fusionar

    const random = Math.random().toString();
    createItem({
      id: "8", //id: "8
      pos: { x: 400, y: 500 }, //pos: {x: 800, y: 800}
      name: random,
    });
    items.forEach((item) => {
      deleteItem(item.id);
    });
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    //obtiene la posición del mouse relativa al div, osea el layout. Con el fin de posicionar el ítem en el lugar correcto.
    const rect = divRef.current?.getBoundingClientRect(); //se llama rect porque es un rectángulo que representa el layout en la pantalla
    const x = event.clientX - rect!.left; //posición x del mouse relativa al layout
    const y = event.clientY - rect!.top; //posición y del mouse relativa al layout

    if (event.dataTransfer) {
      const id = event.dataTransfer.getData("item"); //get the id of the item
      console.log("drop id", id);
      const item = document.getElementById(id) as HTMLElement; //get the item
      const target = event.target as HTMLElement; //get the target where the item is dropped
      if (target.classList.contains("item__canva")) {
        console.log("Es un item");
        fuse([item, target], x, y);
      } else {
        console.log("Es un layout,solo se mueve");
        console.log("se mueve " + id);
        moveItem(id, { x, y });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("drop", handleDrop);
    document.addEventListener("dragover", (e) => e.preventDefault());
    return () => {
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragover", (e) => e.preventDefault());
    };
  }, []);

  return (
    <div
      ref={divRef}
      style={{ width: "100%", height: "100vh" }}
      id="layout"
      className="item-container relative "
    >
      <button
        onClick={() =>
          createItem({ id: "8", pos: { x: 800, y: 800 }, name: "Item 8" })
        }
      >
        Add Item
      </button>
      <button onClick={() => deleteItem(5)}>Delete</button>
      <button onClick={() => moveItem("1", { x: 600, y: 500 })}>Move</button>
      {itemsCanva.map((item, index) => {
        return (
          <ItemCanva
            key={item.id}
            id={item.id}
            pos={item.pos}
            name={item.name}
          />
        );
      })}
    </div>
  );
};

export default Canva;
