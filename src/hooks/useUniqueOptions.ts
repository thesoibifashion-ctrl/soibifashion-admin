// hooks/useUniqueOptions.ts
import { useMemo } from "react";

export function useUniqueOptions<T>(
  data: T[] | undefined,
  field: keyof T
) {
  return useMemo(() => {
    if (!data) return [];
    const unique = Array.from(
      new Set(
        data
          .map((item) => item[field])
          .filter((value): value is NonNullable<typeof value> => Boolean(value))
      )
    );
    return unique.map((value) => ({
      label: String(value).charAt(0).toUpperCase() + String(value).slice(1),
      value: String(value),
    }));
  }, [data, field]);
}