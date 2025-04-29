/**
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs de imágenes.
 * @param {string} props.category - Categoría de la colección.
 * @param {number} props.quantity - Cantidad de elementos en la colección.
 */
import {} from 'lucide-react';
import { Link } from 'react-router';

function CollectionCard({ images: pins = [], collectionId, userId, handleModal, quantity, category, isPublic }) {
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
        <div className="flex flex-row items-center justify-between">
          <Link to={`/collections/${userId}/${collectionId}`} className="cursor-pointer truncate text-lg font-semibold text-black hover:underline">
            {category}
          </Link>
          <div>
            {!isPublic && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-secondary text-sm">{quantity} photos</span>
      </div>
    </article>
  );
}
export default CollectionCard;
