"use client";
import { useFormState } from "react-dom";
import { Form } from "app/formreg";
import { SubmitButton } from "app/submit-button";
import Link from "next/link";

// Musisz przekazać funkcję register jako prop z serwera!
export default function RegisterForm({ register }: { register: any }) {
  const [state, formAction] = useFormState(register, null);

  return (
    <Form action={formAction}>
      <SubmitButton>Zarejestruj</SubmitButton>
      {state && (
        <p className="text-center text-sm text-red-600">{state}</p>
      )}
      <p className="text-center text-sm text-gray-600">
        {'Masz już konto? '}
        <Link href="/login" className="font-semibold text-gray-800">
          Zaloguj się
        </Link>
        {'.'}
      </p>
    </Form>
  );
}