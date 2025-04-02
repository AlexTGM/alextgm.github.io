"use client";

import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to
          <span className="text-blue-600">Google One tap login!</span>
        </h1>

        {session ? (
          <>
            <p className="mt-3 text-2xl">
              You are signed in as
              <div className="flex flex-col">
                <span>Name:{session.data?.user?.name}</span>
                <span>Email: {session.data?.user?.email}</span>
              </div>
            </p>

            <button
              className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="mt-3 text-2xl">
            You are not signed in. Google One Tap should appear shortly.
          </div>
        )}
      </main>
    </div>
  );
}
