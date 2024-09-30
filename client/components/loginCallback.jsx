import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function exchangeCodeForToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error(
              `Feil ved henting av token: ${response.statusText}`,
            );
          }

          const data = await response.json();
          sessionStorage.setItem("access_token", data.access_token);
          navigate("/home");
        } catch (err) {
          setError("En feil skjedde under innlogging.");
          console.error(err);
        }
      } else {
        setError("Mangler autorisasjonskode.");
      }
    }

    exchangeCodeForToken();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Vennligst vent, logger inn...</div>;
}
