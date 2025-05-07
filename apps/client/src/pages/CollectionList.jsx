import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';
import AddCollectionCard from '../components/AddCollectionCard';
import ModalPin from '../components/ModalPin';
import { ModalCollection } from '../components/ModalCollection';
import { useModal } from '../hooks/useModal';
import { useSelector } from 'react-redux';

const CollectionList = () => {
  const { collections, userId } = useOutletContext();
  const { showModal } = useModal();
  const [openCollectionCardModal, setOpenCollectionCardModal] = useState(false);
  const user = useSelector(state => state.auth?.user);
  const handleModal = () => setOpenCollectionCardModal(true);
  const handleCloseModal = () => setOpenCollectionCardModal(false);

  const isOwner = user ? user.id === userId : false;
  return (
    <>
      {collections && collections.length > 0 ? (
        <>
          {collections.map(({ id, name, pins, userId: user, isPublic }, index) => (
            <React.Fragment key={id}>
              {index === 2 && <AddCollectionCard openModal={handleModal} />}
              <CollectionCard
                handleModal={() => showModal(<ModalPin collections={collections} userId={userId} collectionId={id} />)}
                category={name}
                userId={user}
                isPublic={isPublic}
                quantity={pins.length}
                collectionId={id}
                images={pins}
              />
            </React.Fragment>
          ))}

          {collections.length > 0 && collections.length < 3 && isOwner && <AddCollectionCard openModal={handleModal} />}
        </>
      ) : (
        /* Hacer una animación de colleccion vacia */
        <>
          {isOwner && <AddCollectionCard openModal={handleModal} />}
          <div className="flex flex-col my-auto items-center mt-10 justify-center row-span-3 col-span-3">
            <div className="relative w-64 h-64 mb-6 animate-pulse">
              <div className="absolute w-40 h-40 bg-gray-100 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              <div className="absolute w-32 h-4 bg-gray-200 rounded-full left-1/2 bottom-0 transform -translate-x-1/2 blur-md"></div>
            </div>

            <h2 className="text-xl font-medium text-gray-700 mb-2">No hay colecciones</h2>
            <p className="text-gray-500 text-center max-w-md">
              Aún no has creado ninguna colección. Crea una para organizar tus elementos favoritos.
            </p>
          </div>
        </>
      )}

      {openCollectionCardModal && <ModalCollection isOpen={openCollectionCardModal} onClose={handleCloseModal} />}
    </>
  );
};

export default CollectionList;
