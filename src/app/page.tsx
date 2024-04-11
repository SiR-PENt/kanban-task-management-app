"use client";

import Boards from "./root-components/Boards";
import Sidebar from "./root-components/Sidebar";


export default function Dashboard() {

  return (
    <main className="h-full">
      <div className="md:flex h-full">
        <Sidebar />
        <Boards />
      </div>
    </main>
  );
}
