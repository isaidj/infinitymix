import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface Card {
  image: string;
  cardContent: { fuseItems: string; result: string };
  active?: boolean;
  onAnimationEnd?: Function;
  animationDuration?: number;
}

interface CardContextProps {
  card: Card;
  setCard: Dispatch<SetStateAction<Card>>;
}

const CardContext = createContext<CardContextProps>({
  card: {
    image: "./card.png",
    cardContent: { fuseItems: "", result: "" },
  },
  setCard: () => {},
});

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [card, setCard] = useState<Card>({
    image: "",
    cardContent: { fuseItems: "", result: "" },
  });

  const value = {
    card,
    setCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCard = () => useContext(CardContext);
