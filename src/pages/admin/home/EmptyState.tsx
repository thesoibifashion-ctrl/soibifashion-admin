"use client";

import type { CustomizationDefinition } from "@/utils/customization";


interface CustomizationEmptyStateProps {
  definition: CustomizationDefinition;
  loading?: boolean;
  creating?: boolean;
  onStartCreating: () => void;
}

export function CustomizationEmptyState({
  definition,
  loading = false,
  creating = false,
  onStartCreating,
}: CustomizationEmptyStateProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Loading {definition.name.toLowerCase()}...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <h3 className="text-base font-semibold">
        {definition.name}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This customization category hasn't been created yet.
        Start creating it to add and manage its options.
      </p>

      <button
        type="button"
        onClick={onStartCreating}
        disabled={creating}
        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creating ? "Creating..." : "Start Creating"}
      </button>
    </div>
  );
}