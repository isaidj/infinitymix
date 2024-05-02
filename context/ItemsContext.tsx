import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// Interface para definir las propiedades de los ítems
interface Item {
  name: string;
}

// Interface para definir las propiedades del contexto
interface ItemsContextProps {
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
  checkItem: (item: Item) => boolean;
  addItem: (item: Item) => void;
}

// Creación del contexto
const ItemsContext = createContext<ItemsContextProps>({
  items: [],
  setItems: () => {},
  checkItem: () => false,
  addItem: () => {},
});

const initialItems: Item[] = [
  { name: "💧Agua" },
  { name: "🔥Fuego" },
  { name: "🌱Tierra" },
  { name: "🌬️Aire" },
  { name: "🕰️Tiempo" },
];

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Item[]>(initialItems);

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
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useItemsContext = () => useContext(ItemsContext);

export default ItemsContext;
