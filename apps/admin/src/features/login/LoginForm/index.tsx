"use client";

import { FC, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@repo/ui/Control";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { ApiResponse } from "~lib/api/envelope";

import { loginSchema, LoginFormValues } from "./login-schema";

export const LoginForm: FC = () => {
  const t = useTranslations("LoginForm");
  const tV = useTranslations("Validations");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const siteApiUrl = process.env.NEXT_PUBLIC_SITE_API_URL ?? "";

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${siteApiUrl}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body: ApiResponse<null> = await res.json();
      if (!res.ok || body.error) {
        setServerError(t("genericError"));
        return;
      }
      router.push("admin");
    } catch {
      setServerError(t("genericError"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm"
      noValidate
    >
      <h5 className="!text-white mb-6">{t("title")}</h5>

      <fieldset className="w-full mb-4">
        <Text.Base
          type="email"
          id="email"
          placeholder={t("emailPlaceholder")}
          error={!!errors.email}
          touched={!!touchedFields.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <span
            id="email-error"
            role="alert"
            className="text-error text-xs mt-1 block"
          >
            {tV(errors.email.message as Parameters<typeof tV>[0])}
          </span>
        )}
      </fieldset>

      <fieldset className="w-full mb-6">
        <Text.Base
          type="password"
          id="password"
          placeholder={t("passwordPlaceholder")}
          error={!!errors.password}
          touched={!!touchedFields.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <span
            id="password-error"
            role="alert"
            className="text-error text-xs mt-1 block"
          >
            {tV(errors.password.message as Parameters<typeof tV>[0])}
          </span>
        )}
      </fieldset>

      {serverError && (
        <p role="alert" className="text-error text-sm mb-4">
          {serverError}
        </p>
      )}

      <Button.Base type="submit" className="w-full" disabled={isSubmitting}>
        {t("submit")}
      </Button.Base>
    </form>
  );
};
