import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";

export function useMutation<TInput, TOutput>(fn: (input: TInput) => Promise<TOutput>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput> => {
      setLoading(true);
      setError(null);
      try {
        return await fn(input);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Terjadi kesalahan, coba lagi.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { mutate, loading, error };
}
