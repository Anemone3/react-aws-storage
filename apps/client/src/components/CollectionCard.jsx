/**
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs de imágenes.
 * @param {string} props.category - Categoría de la colección.
 * @param {number} props.quantity - Cantidad de elementos en la colección.
 */

function CollectionCard({ images, category, quantity }) {
  return (
    <article>
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        {images &&
          images.map((image, index) => (
            <img
              className={`${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} h-full w-full object-cover`}
              key={image}
              src={image}
              alt={category}
            />
          ))}
      </div>
      <h3 className="text-lg font-semibold text-black">{category}</h3>
      <span className="text-secondary text-[13px]">{quantity} photos</span>
    </article>
  );
}
export default CollectionCard;
