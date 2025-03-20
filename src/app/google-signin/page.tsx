import { SessionProvider } from "next-auth/react";
import ClientSignInPage from "@/app/google-signin/client-page";

const SignInPage = () => {
  return (
    <SessionProvider>
      <ClientSignInPage />
    </SessionProvider>
  );
};

export default SignInPage;
