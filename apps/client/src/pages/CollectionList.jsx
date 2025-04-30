import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';
import AddCollectionCard from '../components/AddCollectionCard';
import ModalPin from '../components/ModalPin';
import { ModalCollection } from '../components/ModalCollection';
import { useModal } from '../hooks/useModal';

const CollectionList = () => {
  const { collections, userId } = useOutletContext();
  const { showModal } = useModal();
  const [openCollectionCardModal, setOpenCollectionCardModal] = useState(false);

  const handleModal = () => setOpenCollectionCardModal(true);
  const handleCloseModal = () => setOpenCollectionCardModal(false);
  console.log('collections', collections);

  return (
    <>
      {collections && (
        <>
          {collections.length === 0 && <AddCollectionCard openModal={handleModal} />}

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

          {collections.length > 0 && collections.length < 3 && <AddCollectionCard openModal={handleModal} />}
        </>
      )}

      {openCollectionCardModal && <ModalCollection isOpen={openCollectionCardModal} onClose={handleCloseModal} />}
    </>
  );
};

export default CollectionList;
