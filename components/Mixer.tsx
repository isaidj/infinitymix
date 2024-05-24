import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Item from "./Item";
import axios from "axios";
import { useItemsContext } from "@/context/ItemsContext";
import Card from "./Card";
import { useCard } from "@/context/CardContext";
interface ItemProps {
  name: string;
}

const Mixer = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [itemsMixer, setItemsMixer] = React.useState<ItemProps[]>([]);
  const { card, setCard } = useCard();
  const { addItem, items } = useItemsContext();

  const addItemToMixer = (item: ItemProps) => {
    setItemsMixer((prevItems) => [...prevItems, item]);
  };

  const handleFuse = async () => {
    const words = itemsMixer.map((item) => item.name);
    console.log(words);
    const response = await postFuse({ words });
    addItem({ name: response });
    let imageGenerated = await postSdxl({ word: response });
    setCard({
      image: imageGenerated,
      cardContent: { fuseItems: words.join(" + "), result: response },
      active: true,
    });
    console.log(response);

    setItemsMixer([]);
  };

  const postFuse = async ({ words }: { words: string[] }) => {
    try {
      const response = await axios
        .post("http://192.168.1.79:3000/api/infinity", {
          words: words,
        })
        .finally(() => {});
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
  useEffect(() => {
    //Función que se ejecuta cuando se suelta un ítem en el layout
    const handleDrop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.classList.contains("item")) {
        console.log(target);
        console.log(e.dataTransfer?.getData("item"));
      }
      target.classList.remove("mixer__hovered");

      //Si el evento (dragstart) tiene dataTransfer, es porque se está arrastrando un ítem
      if (e.dataTransfer) {
        //Obtiene el id del ítem que se está arrastrando, se asigna a la hora de iniciar el arrastre
        const data = e.dataTransfer.getData("item"); //id del item que arrastramos
        const item = document.getElementById(data); //el elemento que arrastramos
        // console.log(item);
        addItemToMixer({ name: item?.textContent || "" });
      }
    };

    const divElement = divRef.current;

    const handleDragEnter = (e: DragEvent) => {
      console.log("dragenter");
      e.stopPropagation();
      const target = e.target as HTMLElement;

      console.log(target);
      target.classList.add("mixer__hovered");
    };
    const handleDragLeave = (e: DragEvent) => {
      console.log("dragleave");
      e.stopPropagation();
      const target = e.target as HTMLElement;

      console.log(target);
      target.classList.remove("mixer__hovered");
    };

    if (divElement) {
      divElement.addEventListener("dragenter", handleDragEnter);
      divElement.addEventListener("dragleave", handleDragLeave);
      divElement.addEventListener("drop", handleDrop);
    }

    return () => {
      if (divElement) {
        divElement.addEventListener("dragenter", handleDragEnter);
        divElement.addEventListener("dragleave", handleDragLeave);
        divElement.removeEventListener("drop", handleDrop);
      }
    };
  }, [itemsMixer]);

  return (
    <div className="mixer__container  ">
      <div className="mixer__header bg-gray-900 text-white text-center p-2 ">
        Mixer
      </div>
      <div id="item-mixer" className="item-mixer" ref={divRef}>
        <div className="mixer__items__container absolute flex flex-wrap gap-2 p-2 justify-center items-center z-10 w-full h-full align-middle">
          {itemsMixer.map((item, index) => (
            <Item key={index} name={item.name} type="item__mixer" />
          ))}
        </div>
        <Image
          src={"/altar.png"}
          alt="altar"
          width={325}
          height={325}
          className="object-cover w-full h-full opacity-70 pointer-events-none rounded-lg"
          draggable="false"
        />
      </div>
      {/* {
          showResultFuse && <div className="mixer__result bg-gray-900 text-white text-center p-2 absolute bottom-0 w-full">
            {items[items.length-1].name}
          </div>
          
        } */}
      <div
        className="mixer__footer bg-gray-900 text-white py-2 pl-1 cursor-pointer"
        onClick={handleFuse}
      >
        <span className="flare"></span>
        <Image
          src={"/fuse.png"}
          alt="fuse"
          width={52}
          height={52}
          className="fuse fixed"
        />
        <div className="mixer__footer__text ml-14 ">Create a new element</div>
      </div>
    </div>
  );
};

export default Mixer;
