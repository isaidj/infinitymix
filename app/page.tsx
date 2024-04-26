import ItemsPanel from "@/components/ItemsPanel";
import Layout from "@/components/Layout";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen  items-start  p-24">
      <Layout width={800} height={800} />

      <ItemsPanel />
    </main>
  );
}
