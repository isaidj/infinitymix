"use client";
import { useState, useEffect, useRef, useContext, useReducer } from "react";

import axios from "axios";
import ItemsContext from "@/context/ItemsContext";
import Mixer from "./Mixer";
import Card from "./Card";
import { useCard } from "@/context/CardContext";
// import fuse from "@/utils/fuse";
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
  const { card, setCard } = useCard();

  const [itemsLayout, setItemsLayout] = useState<Item[]>([]);

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
    const nameHeader = item.querySelector("h1")?.textContent;
    item.id = `${nameHeader}-${itemsLength + 1}-${Date.now()}`;
    item.style.position = "absolute";
    item.style.opacity = "1";
    item.classList.add("old-item");
    item.classList.remove("new-item");
    divRef.current?.appendChild(item);
    item.style.left = `${x - item.clientWidth / 2}px`;
    item.style.top = `${y - item.clientHeight / 2}px`;

    setItemsLayout((prevItems) => [...prevItems, { id: item.id, x, y }]);
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
    setItemsLayout((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === item.id
          ? { ...prevItem, x: item.x, y: item.y }
          : prevItem
      )
    );
  };

  const fuse = async (
    item: HTMLElement,
    target: HTMLElement,
    x: number, //posicion del mouse en x
    y: number //posicion del mouse en y
  ) => {
    const newItem = item.cloneNode(true) as HTMLElement;

    //si el item que se se arrastra es viejo tambien se elimina
    if (item.classList.contains("old-item")) item.remove();
    //el target que ya es viejo se elimina
    target.remove();
    const itemHeader = item.querySelector("h1")?.textContent;
    const targetHeader = target.querySelector("h1")?.textContent;
    let wordGnerated = await postFuse({
      words: [itemHeader, targetHeader],
    });

    newItem.querySelector("h1")!.textContent = wordGnerated;
    let imageGenerated = await postSdxl({ word: wordGnerated });
    addItem({ name: wordGnerated, img: imageGenerated });
    setCard({
      image: imageGenerated,
      cardContent: {
        fuseItems: `${itemHeader} + ${targetHeader}`,
        result: wordGnerated,
      },
      active: true,
    });

    //el div es del mismo tipo que los items

    //se eliminan los items del estado que se fusionaron
    const idToRemove = [item.id, target.id];
    const newItems: Item[] = itemsLayout;
    newItems.filter((item) => !idToRemove.includes(item.id));
    setItemsLayout(newItems);
    //se crea un nuevo item con la posición del mouse
    // createItem({
    //   item: newItem,
    //   itemsLength: items.length + 1,
    //   x,
    //   y,
    // });
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
      console.log(target);
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
            console.log(target);
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

  const postFuse = async ({ words }: { words: string[] }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.79:3000/api/infinity",
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
  const postSdxl = async ({ word }: { word: string }) => {
    try {
      const response = await axios.post(
        "http://192.168.1.79:3000/api/ai-image",
        {
          word: word,
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
      style={{ width: width, height: height }}
      id="layout"
      className="item-container relative "
    >
      <Mixer />
      <button onClick={() => setCard({ ...card, active: !card.active })}>
        Flip
      </button>
      <Card
        imageFront={"/card.png"}
        imageBack={card.image || "/card.png"}
        cardContent={card.cardContent}
        active={card.active}
        // onAnimationEnd={() =>
        //   setCard({
        //     ...card,
        //     cardContent: { result: "", fuseItems: "" },
        //     active: false,
        //   })
        // }
        onClose={() =>
          setCard({
            ...card,
            cardContent: { result: "", fuseItems: "" },
            active: false,
          })
        }
      />
    </div>
  );
};

export default Layout;
