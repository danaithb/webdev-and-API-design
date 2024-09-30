import React from "react";
import { LoginButton } from "../components/loginButton";

export function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-heading">🩷Velkommen til ChatApp🩷</h1>
        <p className="login-subtext">Vennligst logg inn for å forsette</p>
        <LoginButton />
      </div>
    </div>
  );
}
