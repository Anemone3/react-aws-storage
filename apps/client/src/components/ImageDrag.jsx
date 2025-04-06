const ImageDrag = ({
  imageFile,
  imagePreview,
  handleDrop,
  handleFileChange,
  handleRemoveImage,
  isDragging,
  setIsDragging,
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Imagen</label>
      {!imagePreview ? (
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-gray-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-500"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div className="text-sm font-medium">Arrastra tu imagen aquí o</div>
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-blue-600 hover:underline"
            >
              selecciona un archivo
            </label>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG o WEBP (máx. 5MB)
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-300">
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Vista previa"
            className="h-[200px] w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <button
              type="button"
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
              onClick={handleRemoveImage}
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
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="absolute right-0 bottom-0 left-0 truncate bg-black/60 p-2 text-sm text-white">
            {imageFile?.name}
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageDrag;
