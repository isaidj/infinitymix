import { Item } from "@/interfaces/Item";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
// Interface para definir las propiedades de los ítems

// Interface para definir las propiedades del contexto
interface ItemsContextProps {
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
  checkItem: (item: Item) => boolean;
  addItem: (item: Item) => void;
  onDelete: (item: Item) => void;
}

// Creación del contexto
const ItemsContext = createContext<ItemsContextProps>({
  items: [],
  setItems: () => {},
  checkItem: () => false,
  addItem: () => {},
  onDelete: () => {},
});

// const initialItemsES: Item[] = [
//   { name: "💧Agua" },
//   { name: "🔥Fuego" },
//   { name: "🌱Tierra" },
//   { name: "🌬️Aire" },
//   { name: "🔮Magia" },
//   { name: "🕰️Tiempo" },
//   { name: "👨‍🦰Humano" },
// ];
const initialItemsEN: Item[] = [
  {
    name: "💧Water",
    img: "https://replicate.delivery/pbxt/tOawbBD8EmKbPpW9jqOTsTvizkzhAsPrxPhNWIXMmdw77lsE/out-0.png",
  },
  {
    name: "🔥Fire",
    img: "https://replicate.delivery/pbxt/X8lkjjoZBKIqA5BnNDFhFH9yDXXMwJGsOXwZ3GeknUa30LZJA/out-0.png",
  },
  {
    name: "🌱Earth",
    img: "https://replicate.delivery/pbxt/XRFfbuJEFT0rCSwxdPwfMml5FpiwKsE06FPeddfn4gWApeSWC/out-0.png",
  },
  {
    name: "🌬️Air",
    img: "https://replicate.delivery/pbxt/ma3gidJbLf1pSyyDd7Wrhryps8MaI37L10V6PHKmIrwd5LZJA/out-0.png",
  },
  {
    name: "🔮Magic",
    img: "https://replicate.delivery/pbxt/FvWfYvCkwc2kR6fkU9h2f8OKBL0oUtY5KP3eaZ9e15Uwl9SWC/out-0.png",
  },
  {
    name: "🕰️Time",
    img: "https://replicate.delivery/pbxt/W1T8UeZKBfpudUr5DEJxT82rfFXbBfqwDFpkBYdLMVXaVfSWC/out-0.png",
  },
  {
    name: "👨‍🦰Human",
    img: "https://replicate.delivery/pbxt/qnjdz1pcZXagCVYwCOoKQTdbO0Z7bW7sngYPFPwFyX9UeLZJA/out-0.png", //or https://replicate.com/p/6c2xtdwjcsrga0cfb6bvmw8fbr
  },
];

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Item[]>(
    localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items") as string)
      : initialItemsEN
  );

  const checkItem = (item: Item) => {
    return items.some((existingItem) => existingItem.name === item.name);
  };

  const value = {
    items,
    setItems,
    checkItem,
    addItem: (item: Item) => {
      console.log("Adding item", item);
      // Evitar la adición de elementos duplicados
      if (!items.some((existingItem) => existingItem.name === item.name)) {
        setItems((prevItems) => [...prevItems, item]);
      }
    },
    onDelete: (item: Item) => {
      setItems((prevItems) => prevItems.filter((i) => i.name !== item.name));
    },
  };
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useItemsContext = () => useContext(ItemsContext);

export default ItemsContext;
