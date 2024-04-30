"use client";
import { useState, useEffect, useRef, useContext, useReducer } from "react";

import axios from "axios";
import ItemsContext from "@/context/ItemsContext";
import { useCompletion } from "ai/react";

//Interface para definir las propiedades del layout
interface LayoutProps {
  width: string | number;
  height: string | number;
}
interface Item {
  id: string;
  x: number;
  y: number;
}

const Layout = ({ width, height }: LayoutProps) => {
  //Referencia al div que contiene el layout
  const divRef = useRef<HTMLDivElement>(null);

  //Estado para almacenar los ítems en el layout, un array de objetos.
  const { items, checkItem, setItems, addItem } = useContext(ItemsContext);

  const createItem = ({
    item,
    itemsLength,
    x,
    y,
  }: {
    item: HTMLElement;
    itemsLength: number;
    x: number;
    y: number;
    textContent?: string;
  }) => {
    item.id = `${item.textContent}-${itemsLength + 1}-${Date.now()}`;

    item.style.position = "absolute";
    item.style.opacity = "1";
    item.classList.add("old-item");
    item.classList.remove("new-item");
    divRef.current?.appendChild(item);
    item.style.left = `${x - item.clientWidth / 2}px`;
    item.style.top = `${y - item.clientHeight / 2}px`;
  };

  const cloneItem = (item: Item) => {
    const newItem = document
      .getElementById(item.id)
      ?.cloneNode(true) as HTMLElement;

    createItem({
      item: newItem,
      itemsLength: items.length,
      x: item.x,
      y: item.y,
    });
  };

  const moveItem = (item: Item) => {
    const newItem = document.getElementById(item.id) as HTMLElement;
    newItem.style.left = `${item.x - newItem.clientWidth / 2}px`;
    newItem.style.top = `${item.y - newItem.clientHeight / 2}px`;
  };

  const fuse = async (
    item: HTMLElement,
    target: HTMLElement,
    x: number, //posicion del mouse en x
    y: number //posicion del mouse en y
  ) => {
    const newItem = item.cloneNode(true) as HTMLElement;

    let wordGnerated = await postFuse({
      words: [item.textContent, target.textContent],
    });
    wordGnerated ? addItem({ name: wordGnerated }) : null;

    newItem.textContent = wordGnerated;

    //el div es del mismo tipo que los items
    createItem({
      item: newItem,
      itemsLength: items.length + 1,
      x,
      y,
    });

    //si el item que se se arrastra es viejo tambien se elimina
    if (item.classList.contains("old-item")) item.remove();
    //el target que ya es viejo se elimina
    target.remove();
  };

  useEffect(() => {
    //Función que se ejecuta cuando se suelta un ítem en el layout
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      //obtiene la posición del mouse relativa al div, osea el layout. Con el fin de posicionar el ítem en el lugar correcto.
      const rect = divRef.current?.getBoundingClientRect(); //se llama rect porque es un rectángulo que representa el layout en la pantalla
      const x = e.clientX - rect!.left; //posición x del mouse relativa al layout
      const y = e.clientY - rect!.top; //posición y del mouse relativa al layout
      const target = e.target as HTMLElement;
      if (target.classList.contains("item")) {
        console.log(target);
        console.log(e.dataTransfer?.getData("item"));
      }
      //Si el evento (dragstart) tiene dataTransfer, es porque se está arrastrando un ítem
      if (e.dataTransfer) {
        //Obtiene el id del ítem que se está arrastrando, se asigna a la hora de iniciar el arrastre
        const data = e.dataTransfer.getData("item"); //id del item que arrastramos
        const item = document.getElementById(data); //el elemento que arrastramos

        //Si el ítem es nuevo, se clona y se añade al layout
        if (item?.classList.contains("new-item")) {
          if (target.classList.contains("item")) {
            const newItem = document.getElementById(data) as HTMLElement;
            console.log(data);
            newItem.id = `${data}-${items.length + 1}`;
            fuse(newItem, target, x, y);
            return;
          }
          cloneItem({ id: data, x, y });
        }
        //Si el ítem es viejo
        if (item?.classList.contains("old-item")) {
          //Si el ítem ya existe en el layout, se mueve a la posición actual del mouse
          if (target.classList.contains("item-container")) {
            moveItem({ id: data, x, y });
          }
          //Si el ítem se suelta sobre otro ítem, se elimina el ítem que se está arrastrando y el ítem sobre el que se suelta, se genera un nuevo ítem con la posición del ítem que se eliminó.
          if (target.classList.contains("item")) {
            //Si el ítem se suelta sobre sí mismo, no se hace nada
            if (target.id === data) return;
            //Si el ítem se suelta sobre otro ítem, se fusionan los textos de ambos ítems y se genera un nuevo ítem
            fuse(item, target, x, y);
          }
        }
        if (target.classList.contains("item-mixer")) {
          const mixer = document.getElementById("item-mixer") as HTMLElement;
          moveItem({ id: data, x: mixer.offsetLeft, y: mixer.offsetTop });
        }
      }
    };

    const divElement = divRef.current;
    if (divElement) {
      divElement.addEventListener("dragover", (e) => e.preventDefault());
      divElement.addEventListener("drop", handleDrop);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener("dragover", (e) => e.preventDefault());
        divElement.removeEventListener("drop", handleDrop);
      }
    };
  }, [items]);

  const postFuse = async ({ words }: { words: string[] }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.127:3000/api/infinity",
        {
          words: words,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const currentItems = () => {
    const currentItems = document.querySelectorAll(".old-item");
    const items: Item[] = [];
    currentItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      items.push({ id: item.id, x: rect.left, y: rect.top });
    });
    // setItems(items);
  };

  return (
    <div
      ref={divRef}
      style={{ width: width, height: "100vh" }}
      id="layout"
      className="item-container relative bg-gray-800  shadow-inner[1px] border-r-2 border-gray-500 border-dashed "
    >
      <div
        id="item-mixer"
        className="item-mixer absolute top-0 left-0 w-60 h-60 bg-blue-900 border-2 border-blue-500 border-dashed rounded-r-lg"
      ></div>
    </div>
  );
};

export default Layout;

const Mixer = () => {
  const [items, setItems] = useState<Item[]>([]);

  return (
    <div
      id="item-mixer"
      className="item-mixer absolute top-0 left-0 w-60 h-60 bg-blue-900 border-2 border-blue-500 border-dashed rounded-r-lg"
    ></div>
  );
};
