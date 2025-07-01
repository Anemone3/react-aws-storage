import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGetAllCollectionsQuery } from '../redux/services/collection-api';
import CollectiosSelectedChange from './CollectiosSelectedChange';

export default function CollectionSelector({ userId, onSave, onClose, pinId }) {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef(null);

  const { data, isLoading } = useGetAllCollectionsQuery({ userId });

  let filteredCollections = [];

  if (data && data.collections.length > 0) {
    filteredCollections = data?.collections.filter(collection => collection.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  useLayoutEffect(() => {
    if (data && data.collections.length > 0) {
      const collectionWithPin = data.collections.find(collection => collection.pins.some(pin => pin.id === pinId));
      if (collectionWithPin) {
        setSelectedCollection(collectionWithPin.id);
      }
    }
  }, [data, pinId]);

  // Manejar clic fuera del selector para cerrarlo
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSave = async () => {
    if (!selectedCollection) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(selectedCollection);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isPinInCollection = collection => {
    return collection.pins.some(pin => pin.id === pinId);
  };

  return (
    <div
      ref={selectorRef}
      className="absolute top-11 right-0 z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Guardar en colección</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar colección..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div> Cargando... </div>
      ) : (
        <>
          {filteredCollections.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              <div className="space-y-1">
                <CollectiosSelectedChange
                  collections={filteredCollections}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                />
              </div>
            </div>
          ) : (
            <p className="py-2 text-center text-sm text-gray-500">
              {data && data?.collections.length === 0 ? 'No tienes colecciones' : 'No se encontraron colecciones'}
            </p>
          )}
        </>
      )}

      <button
        onClick={handleSave}
        disabled={!selectedCollection || isSaving}
        className={`mt-3 w-full rounded py-2 px-4 text-sm font-medium text-white transition ${
          selectedCollection ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
}
