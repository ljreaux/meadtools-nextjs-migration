"use client";

import { useTranslation } from "react-i18next";
import { Input } from "./ui/input";
import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import { LoadingButton } from "./ui/LoadingButton";

function AuthForm({
  formText,
  authFunction,
}: {
  formText: string;
  authFunction: (email: string, password: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);
    try {
      await authFunction(email, password);
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="grid grid-cols-3 items-center justify-center gap-4 p-8 my-8 w-11/12 max-w-[50rem] rounded-xl bg-background"
      onSubmit={handleSubmit}
    >
      <h1 className="col-span-3 text-center text-2xl">{formText}</h1>
      <label htmlFor="email">{t("accountPage.email")}</label>

      <Input
        type="email"
        id="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="col-span-2"
        disabled={loading} // Disable input during loading
      />

      <label htmlFor="password">{t("accountPage.password")}</label>
      <PasswordInput
        id="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="col-span-2"
        disabled={loading} // Disable input during loading
      />

      <LoadingButton
        type="submit"
        variant={"secondary"}
        className="col-span-3"
        loading={loading}
      >
        {formText}
      </LoadingButton>
    </form>
  );
}

export default AuthForm;
