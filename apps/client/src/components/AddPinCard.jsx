import { useState } from "react";
import ImageDrag from "./ImageDrag";

const AddPinCard = ({
  handleSubmit,
  formState,
  onChange,
  collections,
  setFormState,
  onClose,
  formErrors,
  setFormErrors,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const { title, description, collectionId, pin } = formState;

  const handleFileChange = ({ target }) => {
    const file = target.files?.[0] || null;

    console.log(target.files);
    if (file) {
      const valid = validateFile(file);
      if (!valid) return;
      setFormState((p) => ({ ...p, pin: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      const valid = validateFile(file);
      if (!valid) return;
      setFormState((p) => ({ ...p, pin: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormState((p) => ({ ...p, pin: null }));
    setImagePreview(null);
  };
  const validateFile = (file) => {
    const MAX_SIZE_MB = 1;
    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setFormErrors((p) => ({
        ...p,
        pin: `El archivo debe ser una imagen ${validTypes.filter((v) => v !== file.type).map((v) => v.replace("image/", ""))}`,
      }));
      return false;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFormErrors((p) => ({
        ...p,
        pin: `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)} MB  (max ${MAX_SIZE_MB} MB)`,
      }));
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 p-6">
        {/* Título */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            id="title"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ingresa un título para tu imagen"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            className="min-h-[100px] w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Describe tu imagen"
            name="description"
            value={description}
            onChange={onChange}
          />
        </div>

        {/* Colección */}
        <div className="space-y-2">
          <label
            htmlFor="collection"
            className="block text-sm font-medium text-gray-700"
          >
            Colección
          </label>
          <select
            id="collectionId"
            className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={collectionId}
            name="collectionId"
            onChange={onChange}
          >
            <option value="">Selecciona una colección</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
          {formErrors.collectionId && (
            <p className="text-sm text-red-500">{formErrors.collectionId}</p>
          )}
        </div>

        {/* Imagen */}
        <ImageDrag
          imageFile={pin}
          imagePreview={imagePreview}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        {formErrors.pin && (
          <p className="text-sm text-red-500">{formErrors.pin}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t bg-gray-50 p-4">
        <button
          type="button"
          className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Guardar imagen
        </button>
      </div>
    </form>
  );
};

export default AddPinCard;
