"use client";
import Canva from "@/components/Canva";
import Canvas from "@/components/Canva";
import ItemsPanel from "@/components/ItemsPanel";
import Layout from "@/components/Layout";
import { ItemsProvider } from "@/context/ItemsContext";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen  items-start justify-start main-background background__blueprint__lines">
      <ItemsProvider>
        <Layout width={"100%"} height={"100%"} />

        <ItemsPanel />
      </ItemsProvider>
    </main>
  );
}
