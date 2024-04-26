"use client";
import { useState, useEffect, useRef } from "react";
import { useMousePositionRelative } from "@/hooks/useMousePositionRelative";
import axios from "axios";
import ParticlesCanvas from "./ParticlesCanvas";
import ParticleEffect from "./ParticleEffect";

//Interface para definir las propiedades del layout
interface LayoutProps {
  width: number;
  height: number;
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
  const [items, setItems] = useState<Item[]>([]);

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
    item.id = `${item}-${itemsLength++}`;

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
      itemsLength: items.length++,
      x: item.x,
      y: item.y,
    });
  };

  const moveItem = (item: Item) => {
    const newItem = document.getElementById(item.id) as HTMLElement;
    newItem.style.left = `${item.x - newItem.clientWidth / 2}px`;
    newItem.style.top = `${item.y - newItem.clientHeight / 2}px`;
  };

  const fuse = (
    item: HTMLElement,
    target: HTMLElement,
    x: number, //posicion del mouse en x
    y: number //posicion del mouse en y
  ) => {
    const concatenarTextContent = () => {
      const textContent = item.textContent;
      const targetTextContent = target.textContent;
      return `${textContent} ${targetTextContent}`;
    };

    //el div es del mismo tipo que los items
    const newItem = item.cloneNode(true) as HTMLElement;
    newItem.textContent = concatenarTextContent();

    createItem({
      item: newItem,
      itemsLength: items.length++,
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
        console.log(target.id);
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
            newItem.id = `${data}-${items.length++}`;
            fuse(newItem, target, x, y);
            return;
          }
          cloneItem({ id: data, x, y });
        }
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

  useEffect(() => {
    //Se obtienen los ítems del layout desde la API
    const getItems = async () => {
      try {
        const response = await axios.post(
          "http://192.168.1.127:3000/api/infinity"
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, []);

  const currentItems = () => {
    const currentItems = document.querySelectorAll(".old-item");
    const items: Item[] = [];
    currentItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      items.push({ id: item.id, x: rect.left, y: rect.top });
    });
    setItems(items);
  };

  return (
    <div
      ref={divRef}
      style={{ width, height }}
      id="layout"
      className="item-container relative bg-gray-800"
    >
      <div className="absolute top-0 right-0 bg-gray-800 p-2">
        <button
          onClick={currentItems}
          className="bg-gray-600 text-white p-2 rounded-md"
        >
          update
        </button>
      </div>
    </div>
  );
};

export default Layout;
