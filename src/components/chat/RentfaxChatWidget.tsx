"use client";

import { useState } from "react";
import ChatWindowCustomer from "./ChatWindowCustomer";
import ChatLauncher from "./ChatLauncher";

export default function RentfaxChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <ChatLauncher open={() => setOpen(true)} />}
      {open && <ChatWindowCustomer close={() => setOpen(false)} />}
    </>
  );
}
