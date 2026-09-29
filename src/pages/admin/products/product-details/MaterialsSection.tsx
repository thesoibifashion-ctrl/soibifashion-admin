import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, X, Pencil, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import type { Measurement, ProductMeasurement } from "@/types";

export interface EditableProductMeasurement extends ProductMeasurement {
  isNew?: boolean;
}

interface Props {
  editing: boolean;
  productMeasurements: EditableProductMeasurement[];
  measurements: Measurement[];
  savingMeasurementId: string | null;
  measurementBusyId: string | null; // definition currently being created/updated/deleted
  uploadingImage: boolean;
  onAddProductMeasurement: () => void;
  onValueChange: (index: number, value: string) => void;
  onSaveProductMeasurement: (index: number) => void;
  onRemoveProductMeasurement: (index: number) => void;
  onCreateMeasurement: (payload: { title: string; imageFile: File }) => Promise<void>;
  onUpdateMeasurement: (measurementId: string, payload: { title: string; imageFile?: File }) => Promise<void>;
  onDeleteMeasurement: (measurementId: string) => Promise<void>;
}

const MeasurementsSection = ({
  editing,
  productMeasurements,
  measurements,
  savingMeasurementId,
  measurementBusyId,
  uploadingImage,
  onAddProductMeasurement,
  onValueChange,
  onSaveProductMeasurement,
  onRemoveProductMeasurement,
  onCreateMeasurement,
  onUpdateMeasurement,
  onDeleteMeasurement,
}: Props) => {
  const [manageOpen, setManageOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const usedMeasurementIds = productMeasurements.map((pm) => pm.measurementId);
  const hasMoreMeasurements = measurements.some((m) => !usedMeasurementIds.includes(m.id));
  const hasNoMeasurementsAtAll = measurements.length === 0;

  const handlePickNewImage = (file: File | undefined) => {
    if (!file) return;
    setNewImageFile(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newImageFile) return;
    await onCreateMeasurement({ title: newTitle.trim(), imageFile: newImageFile });
    setNewTitle("");
    setNewImageFile(null);
    setNewPreview(null);
    setShowNewForm(false);
  };

  const startEdit = (measurement: Measurement) => {
    setEditingId(measurement.id);
    setEditTitle(measurement.title);
    setEditPreview(measurement.imageUrl);
    setEditImageFile(null);
  };

  const handlePickEditImage = (file: File | undefined) => {
    if (!file) return;
    setEditImageFile(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (measurementId: string) => {
    if (!editTitle.trim()) return;
    await onUpdateMeasurement(measurementId, {
      title: editTitle.trim(),
      imageFile: editImageFile ?? undefined,
    });
    setEditingId(null);
  };

  const handleDelete = async (measurementId: string) => {
    if (usedMeasurementIds.includes(measurementId)) return; // in use on this product — block
    await onDeleteMeasurement(measurementId);
  };

  return (
    <section className="rounded-2xl border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-near-brown">Measurements</h2>
        <Button size="sm" variant="outline" onClick={onAddProductMeasurement} disabled={!hasMoreMeasurements}>
          <Plus size={14} className="mr-1" /> Add Measurement
        </Button>
      </div>

      {/* ---- Assigned measurement values for this product ---- */}
      {productMeasurements.length === 0 && !hasNoMeasurementsAtAll && (
        <p className="mb-4 text-sm text-gray-500">No measurements assigned yet — click "Add Measurement".</p>
      )}

      <div className="mb-5 space-y-3">
        {productMeasurements.map((pm, index) => {
          const isSaving = savingMeasurementId === pm.measurementId;

          return (
            <div key={pm.measurementId} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              {pm.imageUrl && (
                <img src={pm.imageUrl} alt={pm.title} className="h-12 w-12 rounded-md border object-cover" />
              )}

              <div className="w-32">
                <label className="mb-1 block text-xs font-medium text-gray-600">Measurement</label>
                <div className="flex h-9 items-center rounded-md border border-input px-2 text-sm font-medium">
                  {pm.title}
                </div>
              </div>

              <div className="w-40">
                <label className="mb-1 block text-xs font-medium text-gray-600">Value</label>
                <Input
                  value={pm.value}
                  onChange={(e) => onValueChange(index, e.target.value)}
                  placeholder='e.g. 42"'
                />
              </div>

              {editing && (
                <Button size="sm" variant="outline" onClick={() => onSaveProductMeasurement(index)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : "Save"}
                </Button>
              )}

              <button
                type="button"
                onClick={() => onRemoveProductMeasurement(index)}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ---- Manage measurement definitions (collapsible) ---- */}
      <div className="border-t pt-4">
        <button
          type="button"
          onClick={() => setManageOpen((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium text-gray-600 hover:text-near-brown"
        >
          Manage Measurement Types ({measurements.length})
          {manageOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {manageOpen && (
          <div className="mt-3 space-y-2">
            {hasNoMeasurementsAtAll && !showNewForm && (
              <p className="text-sm text-gray-500">No measurement types yet — add your first one below.</p>
            )}

            {measurements.map((measurement) => {
              const isEditingRow = editingId === measurement.id;
              const isBusy = measurementBusyId === measurement.id;
              const inUse = usedMeasurementIds.includes(measurement.id);

              if (isEditingRow) {
                return (
                  <div key={measurement.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-gray-50 p-2">
                    {editPreview && (
                      <img src={editPreview} alt="" className="h-10 w-10 rounded-md border object-cover" />
                    )}
                    <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-gray-400 hover:text-gray-600">
                      <ImagePlus size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePickEditImage(e.target.files?.[0])}
                      />
                    </label>
                    <Input
                      className="w-40"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Button size="sm" onClick={() => handleUpdate(measurement.id)} disabled={isBusy}>
                      {isBusy ? <Loader2 className="animate-spin" size={14} /> : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X size={14} />
                    </Button>
                  </div>
                );
              }

              return (
                <div key={measurement.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span className="flex items-center gap-2">
                    <img src={measurement.imageUrl} alt="" className="h-8 w-8 rounded-md border object-cover" />
                    <span className="font-medium">{measurement.title}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(measurement)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(measurement.id)}
                      disabled={inUse || isBusy}
                      title={inUse ? "Remove it from this product first" : "Delete measurement type"}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isBusy ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}

            {showNewForm ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-gray-50 p-2">
                {newPreview ? (
                  <img src={newPreview} alt="" className="h-10 w-10 rounded-md border object-cover" />
                ) : (
                  <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-gray-400 hover:text-gray-600">
                    <ImagePlus size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePickNewImage(e.target.files?.[0])}
                    />
                  </label>
                )}
                <Input
                  className="w-40"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chest"
                />
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={uploadingImage || !newTitle.trim() || !newImageFile}
                >
                  {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : "Create"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNewForm(false)}>
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setShowNewForm(true)}>
                <Plus size={14} className="mr-1" /> New Measurement Type
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MeasurementsSection;