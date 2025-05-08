import { useModal } from '../hooks/useModal';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import DropDownPin from './DropDownPin';
import ModalPin from './ModalPin';

const CollectionContent = () => {
  const { collections, userId } = useOutletContext();
  const { collectionId } = useParams();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(collections ? collections.find(collection => collection.id === Number(collectionId)) : []);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    setCollection(collections ? collections.find(collection => collection.id === Number(collectionId)) : []);
  }, [collections]);

  const toggleMenu = id => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  const handleCreatePin = () => {
    showModal(<ModalPin collectionId={collectionId} collections={collections} userId={userId} />);
  };

  const closeAllMenus = () => {
    setOpenMenuId(null);
  };

  if (!collection)
    return (
      <div className="col-span-3 flex h-40 w-full items-center justify-center">
        <p className="text-lg text-gray-500">Colección no encontrada</p>
      </div>
    );

  return (
    <div className="col-span-3 w-full">
      {/* Barra de navegación */}
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/collections/${userId}`} className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium">Volver a Colecciones</span>
        </Link>
      </div>

      {/* Encabezado de la colección */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl px-4 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">{collection.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{collection.description || 'Not description for this collection'}</p>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span>{collection.pins?.length} pins</span>
                <span className="mx-2">•</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - Grid de pines */}
      <div className="w-full mt-8">
        {/* Grid de tipo masonry con columnas responsivas */}
        {collection.pins && collection.pins.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4" onClick={closeAllMenus}>
            {collection.pins.map(pin => (
              <div
                key={pin.id}
                className="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group relative"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={pin.imageUrl || '/placeholder.svg'}
                    alt={pin.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div> */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-medium truncate">{pin.title}</h3>
                    {pin.user && (
                      <div className="flex flex-row gap-1 items-center">
                        <p className="text-white/80 text-sm truncate">Por {pin.user.firstname}</p>
                        <img
                          onClick={() => navigate(`/collections/${pin.user.id}`)}
                          className="cursor-pointer w-8 h-8 rounded-full"
                          src={pin.user.profileUrl}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <button className="text-gray-500 hover:text-rose-500 text-sm font-medium transition-colors">Guardar</button>

                  {/* Menú de tres puntos */}
                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        toggleMenu(pin.id);
                      }}
                      aria-label="Más opciones"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {/* Menú desplegable */}
                    {openMenuId === pin.id && <DropDownPin pin={pin} collectionId={collectionId} closeAllMenus={closeAllMenus} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500 mb-4">Esta colección no tiene pines todavía</p>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition-colors"
              onClick={handleCreatePin}
            >
              <Plus className="h-4 w-4 mr-1" />
              Crear el primer pin
            </button>
          </div>
        )}
      </div>

      {/* Botón flotante para crear pin en móvil */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          className="h-14 w-14 rounded-full bg-rose-500 text-white shadow-lg flex items-center justify-center hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition-colors"
          onClick={() => {
            // Aquí puedes mostrar el modal para crear un pin
            console.log('Crear pin para colección (móvil):', collection.id);
          }}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CollectionContent;
