import React, { useState, useEffect } from "react";

export function LoginButton() {
  const [authorizationUrl, setAuthorizationUrl] = useState();

  useEffect(() => {
    async function generateAuthorizationUrl() {
      const discoveryDoc = await fetch(
        "https://accounts.google.com/.well-known/openid-configuration",
      ).then((res) => res.json());

      const parameters = {
        response_type: "code",
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.SERVER_ROOT_URI}/login/callback`,
        scope: "openid profile email",
      };

      const url =
        discoveryDoc.authorization_endpoint +
        "?" +
        new URLSearchParams(parameters);
      setAuthorizationUrl(url);
    }

    generateAuthorizationUrl();
  }, []);

  return (
    <a href={authorizationUrl} className="login-button">
      Logg inn med Google
    </a>
  );
}
