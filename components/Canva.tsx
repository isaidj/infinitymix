import { useCompletion } from "ai/react";
import React, { useEffect } from "react";

interface Item {
  id: string;
  x: number;
  y: number;
}
const Canva = ({ width, height }: { width: number; height: number }) => {
  const [items, setItems] = React.useState<Item[]>([]);
  const divRef = React.useRef<HTMLDivElement>(null);
  const {
    completion,
    input,
    setInput,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/infinity",
    body: {
      words: items,
    },
  });
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
  const moveItem = (item: Item) => {
    const newItem = document.getElementById(item.id) as HTMLElement;
    newItem.style.left = `${item.x - newItem.clientWidth / 2}px`;
    newItem.style.top = `${item.y - newItem.clientHeight / 2}px`;
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
            // fuse(newItem, target, x, y);
            return;
          }
        }
        cloneItem({ id: data, x, y });

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
            // fuse(item, target, x, y);
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
  return (
    <div
      ref={divRef}
      style={{ width, height }}
      id="layout"
      className="item-container relative bg-red-950 bg-opacity-50"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={input}
            disabled={true}
            onChange={handleInputChange}
            placeholder="Enter completion"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Canva;
