"use client";

const ClientPage = () => {
  window.opener?.postMessage("auth-finished");

  return <div>Redirecting...</div>;
};

export default ClientPage;
