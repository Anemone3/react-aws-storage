/**
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs de imágenes.
 * @param {string} props.category - Categoría de la colección.
 * @param {number} props.quantity - Cantidad de elementos en la colección.
 */

function CollectionCard({ images = [], category, quantity }) {
  const filledImages =
    images.length < 3
      ? [...images, ...Array(3 - images.length).fill(null)]
      : images;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
    {/* Mostrar las imágenes */}
    {images.length > 0 ? (
      <div className="grid h-64 grid-cols-3 grid-rows-2 gap-2">
        {filledImages.slice(0, 3).map((image, index) =>
          image ? (
            <img
              className={`h-full w-full object-cover ${
                index === 0
                  ? "col-span-2 row-span-2"
                  : "col-span-1 row-span-1"
              }`}
              key={index}
              src={image.imageUrl}
              alt={`Image ${index + 1}`}
            />
          ) : (
            <div
              key={index}
              className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600"
            >
              <span>Add more</span>
            </div>
          ),
        )}
      </div>
    ) : (
      <div className="flex h-64 items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
        Start pinning
      </div>
    )}

    {/* Información de la categoría y cantidad */}
    <div className="p-4">
      <h3 className="truncate text-lg font-semibold text-black">
        {category}
      </h3>
      <span className="text-secondary text-sm">{quantity} photos</span>
    </div>
  </article>
  );
}
export default CollectionCard;
