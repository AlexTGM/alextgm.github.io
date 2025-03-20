import { signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  const handleLogin = () => {
    // Redirect-based login
    window.open("/api/auth/signin", "_blank");
  };

  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}
