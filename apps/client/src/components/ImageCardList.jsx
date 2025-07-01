import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddPinToCollectionMutation } from '../redux/services/collection-api';
import { useSelector } from 'react-redux';
import CollectionSelector from './CollectionSelectorGallery';
import { useFormtDate } from '../hooks/useFormatDate';

const ImageCardList = ({ imageUrl, title, description, user, createdAt, id, isSaved: isSavedUser }) => {
  const loggedInUserId = useSelector(state => {
    return state.auth.user?.id;
  });
  const navigate = useNavigate();
  const [addPinToCollection, {}] = useAddPinToCollectionMutation();
  const { formattedDate } = useFormtDate(createdAt);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedUser);
  const [imageError, setImageError] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setIsSaved(isSavedUser);
  }, [isSavedUser]);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleCollectionSelector = () => {
    setShowCollectionSelector(!showCollectionSelector);
  };

  const handleSaveToCollection = async collectionId => {
    try {
      await addPinToCollection({ collectionId: Number(collectionId), pinId: Number(id) });
      setIsSaved(true);
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 1500);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al guardar en colección:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div ref={cardRef} className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        {/* Contenedor con relación de aspecto fija */}
        <div
          className="aspect-square w-full overflow-hidden"
          style={{
            background: '#f5f5f5',
            display: 'block',
            position: 'relative',
          }}
        >
          <img
            src={imageError ? '/placeholder.svg?height=500&width=500' : imageUrl}
            alt={title}
            onError={handleImageError}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            className="transition-transform duration-300 hover:scale-105"
          />

          {/* Animación de guardado */}
          {saveAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
              <div className="rounded-full bg-white p-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Botón de guardar */}
        {loggedInUserId && user.id && (
          <button
            className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={toggleCollectionSelector}
            aria-label="Guardar en colección"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isSaved ? '#e11d48' : 'none'}
              stroke={isSaved ? '#e11d48' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              {isSaved && <polyline points="9 11 12 14 16 10"></polyline>}
            </svg>
          </button>
        )}

        {/* Selector de colecciones */}
        {showCollectionSelector && (
          <CollectionSelector pinId={id} onSave={handleSaveToCollection} userId={loggedInUserId} onClose={() => setShowCollectionSelector(false)} />
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full" style={{ background: '#f5f5f5' }}>
            <img
              src={user.profileUrl || '/placeholder.svg?height=100&width=100'}
              alt={user.username}
              className="cursor-pointer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onClick={() => {
                navigate(`/collections/${user.id}`);
              }}
              onError={e => {
                e.target.src = '/placeholder.svg?height=100&width=100';
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageCardList;
