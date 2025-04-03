'use client'

import {signout} from "@/app/sidepanel/signout";

export function SignOut() {
  return <button onClick={signout}>Sign out</button>;
}
