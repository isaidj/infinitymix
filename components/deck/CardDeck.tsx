import React, { useEffect, useRef } from "react";
import "./deck.css";
import { Item } from "@/interfaces/Item";
import { useItemsContext } from "@/context/ItemsContext";
const CardDeck = ({
  position,
  content,
  style,
}: {
  position: number;
  content: Item;
  //style left and tranform props, add typescript
  style: { left: string; transform: string; width: number; height: number };
}) => {
  const { onDelete } = useItemsContext();
  const divRef = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = React.useState(false);

  const handleHover = (e: any) => {
    //la posicion siguiente, con el dom se obtiene el siguiente elemento, no tenemos el id
    const nextCardId = divRef.current?.nextElementSibling?.id;
    const nextCard = document.getElementById(`${nextCardId}`);
    nextCard?.classList.add("nextCardAnimation");
    setFlip(true);
  };
  const handleLeave = (e: any) => {
    const nextCardId = divRef.current?.nextElementSibling?.id;
    const nextCard = document.getElementById(`${nextCardId}`);
    nextCard?.classList.remove("nextCardAnimation");

    setFlip(false);
  };

  useEffect(() => {
    document.addEventListener("dragstart", (event) => {
      const target = event.target as HTMLElement;
      event.dataTransfer?.setData("item", target.id);

      target.style.opacity = "0";
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
      id={content.name}
      className={`item new-item   cardDeck ${flip ? "flipped" : ""}`}
      style={{
        zIndex: position,
        left: style.left,
        transform: style.transform,
        width: style.width + "px",
        height: style.height + "px",
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      draggable
    >
      <div
        className="cardDeck__inner pointer-events-none"
        style={{ transitionDuration: `0.3s` }}
        // onTransitionEnd={() => onAnimationEnd && onAnimationEnd()}
      >
        <div className="cardDeck__front">
          <div className="deleteCard" onClick={() => onDelete(content)}>
            X
          </div>
          {/* <img src={"/card.png"} alt="Front" className="cardDeck__image" /> */}
          <div className="cardDeck__content">
            <div className="cardDeck__content__header">
              <h1>{content.name}</h1>
            </div>
            {/* <h1>=</h1>
            <h2>resultado</h2> */}
          </div>
          <img src={content.img} alt="Back" className="cardDeck__image" />
        </div>

        <div className="cardDeck__back">
          <div className="deleteCard" onClick={() => onDelete(content)}>
            X
          </div>
          <div className="cardDeck__content">
            <div className="cardDeck__content__header">
              <h1>{content.name}</h1>
            </div>
            {/* <h1>=</h1>
            <h2>resultado</h2> */}
          </div>
          <img src={content.img} alt="Back" className="cardDeck__image" />
        </div>
      </div>
    </div>
  );
};

export default CardDeck;
