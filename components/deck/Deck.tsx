import React, { useEffect, useState } from "react";
import CardDeck from "./CardDeck";
import "./deck.css";
import { Item } from "@/interfaces/Item";
import { useItemsContext } from "@/context/ItemsContext";
//deck of cards

interface CardDeckProps {
  width: number;
  height: number;
  content?: Item;
}

const CardDeckSize: CardDeckProps = {
  width: 110,
  height: 110,
};
const Deck = ({ height }: { height: string }) => {
  const { items, checkItem, setItems, addItem } = useItemsContext();

  const [cardSizes, setCardSizes] = useState<CardDeckProps[]>([]);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const deckLength = items.length;

  const translatePosition = (
    position: number,

    displacement: number
  ) => {
    return Math.sin((position / deckLength) * -Math.PI) * displacement;
  };

  const separationBetweenCards = (position: number, windowWidth: number) => {
    const minSeparation = 0;
    const maxSeparation = 400;
    const separation = windowWidth / deckLength;

    return separation * position;
  };
  useEffect(() => {
    // const handleWindowWidth = () => {
    //   setWindowWidth(window.innerWidth - cardSize.width / 2);
    // };
    // setWindowWidth(window.innerWidth - cardSize.width / 2);
    //Con el ancho de un div que contiene el deck de cartas, se calcula la separación entre las cartas
    const handleDeckContainerWidth = () => {
      const deckContainer = document.querySelector(".deck");
      if (deckContainer) {
        const deckContainerWidth = deckContainer.clientWidth;
        setWindowWidth(deckContainerWidth - CardDeckSize.width / 2);
      }
    };
    handleDeckContainerWidth();

    console.log(windowWidth);
    window.addEventListener("resize", handleDeckContainerWidth);
    return () => {
      window.removeEventListener("resize", handleDeckContainerWidth);
    };
  }, []);
  return (
    <div className="deck__container " style={{ height: height }}>
      <div className="deck">
        {items.map((card, index) => (
          <CardDeck
            key={index}
            position={index}
            style={{
              left: `${separationBetweenCards(index, windowWidth)}px`,
              transform: `translateY(${translatePosition(
                index,

                60
              )}px)`,
              width: CardDeckSize.width,
              height: CardDeckSize.height,
            }}
            // onDeleted={(e: any) => {
            //   setDeck(deck.filter((card) => card.id !== e));
            // }}
            content={card}
          />
        ))}
      </div>
    </div>
  );
};

export default Deck;
