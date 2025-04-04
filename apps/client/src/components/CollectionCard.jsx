/**
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs de imágenes.
 * @param {string} props.category - Categoría de la colección.
 * @param {number} props.quantity - Cantidad de elementos en la colección.
 */

function CollectionCard({ images = [], category, quantity }) {
  const filledImages = images.length < 3
    ? [...images, ...Array(3 - images.length).fill(null)]
    : images

  return (
    <article className="min-h-[280px]">
      {images.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          {filledImages.slice(0,3).map((image, index) =>
            image ? (
              <img
                className={`${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} h-full w-full object-cover`}
                key={image.id}
                src={image.imageUrl}
                alt={image.description}
              />
            ) : (
              <div key={index} className="h-full w-full bg-gray-300" />
            ),
          )}
        </div>
      )}
      {images.length === 0 && (
        <div className="bg-primary text-secondary h-full max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg font-semibold shadow-md md:text-2xl">
          no image
        </div>
      )}
      <h3 className="text-lg font-semibold text-black">{category}</h3>
      <span className="text-secondary text-[13px]">{images.length} photos</span>
    </article>
  );
}
export default CollectionCard;
