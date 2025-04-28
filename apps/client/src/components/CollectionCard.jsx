/**
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs de imágenes.
 * @param {string} props.category - Categoría de la colección.
 * @param {number} props.quantity - Cantidad de elementos en la colección.
 */

import { Link } from 'react-router';

function CollectionCard({ images: pins = [], collectionId, userId, handleModal, quantity, category }) {
  const filledImages = pins.length < 3 ? [...pins, ...Array(3 - pins.length).fill(null)] : pins;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      {pins.length > 0 ? (
        <div onClick={handleModal} className="grid h-64 grid-cols-3 grid-rows-2 gap-2 cursor-pointer">
          {filledImages.slice(0, 3).map((image, index) =>
            image ? (
              <img
                className={`h-full w-full object-cover ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                key={index}
                src={image.imageUrl}
                alt={`Image ${index + 1}`}
              />
            ) : (
              <div key={index} className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600">
                <span>Add more</span>
              </div>
            ),
          )}
        </div>
      ) : (
        <div onClick={handleModal} className="flex h-64 items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600 cursor-pointer">
          Start pinning
        </div>
      )}

      <div className="p-4 flex flex-col gap-1">
        <Link to={`/collections/${userId}/${collectionId}`} className="cursor-pointer truncate text-lg font-semibold text-black hover:underline">
          {category}
        </Link>
        <span className="text-secondary text-sm">{quantity} photos</span>
      </div>
    </article>
  );
}
export default CollectionCard;
