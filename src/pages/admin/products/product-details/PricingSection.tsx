import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Trash2,
  X,
  Pencil,
  ChevronDown,
  ChevronUp,
  Image,
} from "lucide-react";
import type { Currency, ProductPriceResponse } from "@/types";
import { imageUpload } from "@/lib/ImageUpload";
export interface EditablePrice extends ProductPriceResponse {
  isNew?: boolean;
}

interface Props {
  editing: boolean;
  prices: EditablePrice[];
  currencies: Currency[];
  savingCurrencyId: string | null;
  currencyBusyId: string | null;
  onAddPrice: () => void;
  onAmountChange: (index: number, amount: number) => void;
  onSavePrice: (index: number) => void;
  onRemovePrice: (index: number) => void;
  onCreateCurrency: (payload: {
    code: string;
    name: string;
    symbol: string;
  }) => Promise<void>;
  onUpdateCurrency: (
    currencyId: string,
    payload: {
      code: string;
      name: string;
      symbol: string;
    }
  ) => Promise<void>;
  onDeleteCurrency: (currencyId: string) => Promise<void>;
}

const emptyForm = {
  code: "",
  name: "",
  symbol: "",
};

const PricingSection = ({
  editing,
  prices,
  currencies,
  savingCurrencyId,
  currencyBusyId,
  onAddPrice,
  onAmountChange,
  onSavePrice,
  onRemovePrice,
  onCreateCurrency,
  onUpdateCurrency,
  onDeleteCurrency,
}: Props) => {
  const [manageOpen, setManageOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const [newForm, setNewForm] = useState(emptyForm);

  const [editingCurrencyId, setEditingCurrencyId] = useState<string | null>(
    null
  );

  const [editForm, setEditForm] = useState(emptyForm);

  const [uploadingFlag, setUploadingFlag] = useState<
    "new" | "edit" | null
  >(null);

  const usedCurrencyIds = prices.map((p) => p.currencyId);

  const hasMoreCurrencies = currencies.some(
    (c) => !usedCurrencyIds.includes(c.id)
  );

  const hasNoCurrenciesAtAll = currencies.length === 0;

  const handleFlagUpload = async (
    file: File,
    mode: "new" | "edit"
  ) => {
    try {
      setUploadingFlag(mode);

      const result = await imageUpload(file);

      if (mode === "new") {
        setNewForm((prev) => ({
          ...prev,
          name: result.secureUrl,
        }));
      } else {
        setEditForm((prev) => ({
          ...prev,
          name: result.secureUrl,
        }));
      }
    } finally {
      setUploadingFlag(null);
    }
  };

  const handleCreate = async () => {
    if (
      !newForm.code.trim() ||
      !newForm.name.trim() ||
      !newForm.symbol.trim()
    ) {
      return;
    }

    await onCreateCurrency({
      code: newForm.code.trim().toUpperCase(),
      name: newForm.name.trim(),
      symbol: newForm.symbol.trim(),
    });

    setNewForm(emptyForm);
    setShowNewForm(false);
  };

  const startEdit = (currency: Currency) => {
    setEditingCurrencyId(currency.id);

    setEditForm({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
    });
  };

  const handleUpdate = async (currencyId: string) => {
    if (
      !editForm.code.trim() ||
      !editForm.name.trim() ||
      !editForm.symbol.trim()
    ) {
      return;
    }

    await onUpdateCurrency(currencyId, {
      code: editForm.code.trim().toUpperCase(),
      name: editForm.name.trim(),
      symbol: editForm.symbol.trim(),
    });

    setEditingCurrencyId(null);
  };

  const handleDelete = async (currencyId: string) => {
    if (usedCurrencyIds.includes(currencyId)) return;

    await onDeleteCurrency(currencyId);
  };

  return (
    <section className="rounded-2xl border bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-near-brown">Pricing</h2>

        <Button
          size="sm"
          variant="outline"
          onClick={onAddPrice}
          disabled={!hasMoreCurrencies}
        >
          <Plus size={14} className="mr-1" />
          Add Price
        </Button>
      </div>

      {/* Price rows */}
      {prices.length === 0 && !hasNoCurrenciesAtAll && (
        <p className="mb-4 text-sm text-gray-500">
          No prices yet — click "Add Price" to get started.
        </p>
      )}

      <div className="mb-5 space-y-3">
        {prices.map((price, index) => {
          const isSaving = savingCurrencyId === price.currencyId;

          return (
            <div
              key={price.currencyId}
              className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
            >
              <div className="w-20">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Currency
                </label>

                <div className="flex h-9 items-center gap-2 rounded-md border border-input px-2 text-sm font-medium">
                  {price.currency}
                </div>
              </div>

              <div className="w-36">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Amount ({price.symbol})
                </label>

                <Input
                  type="number"
                  value={price.amount || ""}
                  onChange={(e) =>
                    onAmountChange(index, Number(e.target.value))
                  }
                  placeholder="0.00"
                />
              </div>

              {editing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSavePrice(index)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    "Save"
                  )}
                </Button>
              )}

              <button
                type="button"
                onClick={() => onRemovePrice(index)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Manage currencies */}
      <div className="border-t pt-4">
        <button
          type="button"
          onClick={() => setManageOpen((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium text-gray-600 hover:text-near-brown"
        >
          Manage Currencies ({currencies.length})

          {manageOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {manageOpen && (
          <div className="mt-3 space-y-2">
            {hasNoCurrenciesAtAll && !showNewForm && (
              <p className="text-sm text-gray-500">
                No currencies yet — add your first one below.
              </p>
            )}

            {/* Existing currencies */}
            {currencies.map((currency) => {
              const isEditingRow =
                editingCurrencyId === currency.id;

              const isBusy = currencyBusyId === currency.id;

              const inUse = usedCurrencyIds.includes(currency.id);

              if (isEditingRow) {
                return (
                  <div
                    key={currency.id}
                    className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed bg-gray-50 p-2"
                  >
                    {/* Code */}
                    <Input
                      className="w-20"
                      value={editForm.code}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          code: e.target.value,
                        }))
                      }
                      placeholder="Code"
                      maxLength={6}
                    />

                    {/* Flag */}
                    <div className="w-40">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Flag
                      </label>

                      <label className="flex h-8 w-8 cursor-pointer items-center gap-2 rounded-md border bg-white  text-sm">
                        {uploadingFlag === "edit" ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : editForm.name ? (
                          <img
                            src={editForm.name}
                            alt={editForm.code}
                            className="h-full w-full rounded-sm object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">
                           <Image/> Upload flag
                          </span>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingFlag === "edit"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              handleFlagUpload(file, "edit");
                            }

                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>

                    {/* Symbol */}
                    <Input
                      className="w-16"
                      value={editForm.symbol}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          symbol: e.target.value,
                        }))
                      }
                      placeholder="Sym"
                      maxLength={3}
                    />

                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdate(currency.id)
                      }
                      disabled={
                        isBusy ||
                        uploadingFlag === "edit"
                      }
                    >
                      {isBusy ? (
                        <Loader2
                          className="animate-spin"
                          size={14}
                        />
                      ) : (
                        "Save"
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingCurrencyId(null)
                      }
                    >
                      <X size={14} />
                    </Button>
                  </div>
                );
              }

              return (
                <div
                  key={currency.id}
                  className="flex items-center justify-between rounded-lg border p-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {currency.name && (
                      <img
                        src={currency.name}
                        alt={currency.code}
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                    )}

                    <span className="font-medium">
                      {currency.code}
                    </span>

                    <span className="text-gray-500">
                      · {currency.symbol}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(currency)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(currency.id)
                      }
                      disabled={inUse || isBusy}
                      title={
                        inUse
                          ? "Remove this currency's price on the product first"
                          : "Delete currency"
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isBusy ? (
                        <Loader2
                          className="animate-spin"
                          size={14}
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* New currency form */}
            {showNewForm ? (
              <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed bg-gray-50 p-2">
                {/* Code */}
                <Input
                  className="w-20"
                  value={newForm.code}
                  onChange={(e) =>
                    setNewForm((f) => ({
                      ...f,
                      code: e.target.value,
                    }))
                  }
                  placeholder="USD"
                  maxLength={6}
                />

                {/* Flag */}
                <div className="w-40">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Flag
                  </label>

                  <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-white px-2 text-sm">
                    {uploadingFlag === "new" ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : newForm.name ? (
                      <img
                        src={newForm.name}
                        alt={newForm.code}
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">
                        Upload flag
                      </span>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingFlag === "new"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          handleFlagUpload(file, "new");
                        }

                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {/* Symbol */}
                <Input
                  className="w-16"
                  value={newForm.symbol}
                  onChange={(e) =>
                    setNewForm((f) => ({
                      ...f,
                      symbol: e.target.value,
                    }))
                  }
                  placeholder="$"
                  maxLength={3}
                />

                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={
                    currencyBusyId === "new" ||
                    uploadingFlag === "new" ||
                    !newForm.code.trim() ||
                    !newForm.name.trim() ||
                    !newForm.symbol.trim()
                  }
                >
                  {currencyBusyId === "new" ? (
                    <Loader2
                      className="animate-spin"
                      size={14}
                    />
                  ) : (
                    "Create"
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowNewForm(false);
                    setNewForm(emptyForm);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewForm(true)}
              >
                <Plus size={14} className="mr-1" />
                New Currency
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;