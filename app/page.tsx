"use client";
import Canva from "@/components/Canva";

import ItemsPanel from "@/components/ItemsPanel";
import Layout from "@/components/Layout";

import { ItemsProvider } from "@/context/ItemsContext";

export default function Home() {
  return (
    <main className="flex min-h-screen  items-start justify-start main-background background__blueprint__lines">
      <ItemsProvider>
        <Layout width={"100%"} height={"100%"} />
        {/* <Canva /> */}

        <ItemsPanel />
      </ItemsProvider>
    </main>
  );
}
