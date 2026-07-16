import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Logowanie — Moc Płomienia",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-center font-heading text-2xl font-bold text-text-dark">
          Zaloguj się
        </h1>
        <p className="mt-2 text-center text-sm text-text-muted">
          Podaj swój adres e-mail, a wyślemy Ci link do logowania.
        </p>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
