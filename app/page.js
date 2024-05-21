'use client'
import Admin from "./admin/page";
import { useSession } from 'next-auth/react';
import Login from "./login/page";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div>
      {/* {session ? <Admin /> : <Login />} */}
      <Admin />
    </div>
  );
}
