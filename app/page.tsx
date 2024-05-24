"use client";

import ItemsPanel from "@/components/ItemsPanel";
import Layout from "@/components/Layout";
import Deck from "@/components/deck/Deck";
import { CardProvider, useCard } from "@/context/CardContext";

import { ItemsProvider } from "@/context/ItemsContext";

export default function Home() {
  const { card, setCard } = useCard();
  return (
    <main className="flex-col min-h-screen   main-background background__blueprint__lines">
      <ItemsProvider>
        <CardProvider>
          <div className="flex justify-center items-center relative">
            <Layout width={"100%"} height={"80vh"} />
            {/* 
            <ItemsPanel /> */}
          </div>
          <Deck height={"20vh"} />
        </CardProvider>
      </ItemsProvider>
    </main>
  );
}
