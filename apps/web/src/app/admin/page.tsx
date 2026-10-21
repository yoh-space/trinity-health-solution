"use client";

import dynamic from "next/dynamic";

const AdminManager = dynamic(() => import("./AdminManager"), { ssr: false });

export default function AdminPage() {
  return (
    <AdminManager />
  );
}
