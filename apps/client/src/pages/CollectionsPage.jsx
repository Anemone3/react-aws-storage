import React, { useState } from "react";
import AddCollectionCard from "../components/AddCollectionCard";
import CollectionCard from "../components/CollectionCard";
import { useGetAllCollectionsQuery } from "../redux/services/collection-api";
import { useParams } from "react-router";
import { ModalCollection } from "../components/ModalCollection";
import { useModal } from "../hooks/useModal";
import ModalPin from "../components/ModalPin";

const prueba = [
  {
    images: [
      "https://i.pinimg.com/736x/2c/08/97/2c0897ffee55e0eeb3c9174303808ec6.jpg",
      "https://i.pinimg.com/736x/f8/9e/65/f89e65c11e5f87d24bbf38e67d3a91a1.jpg",
      "https://i.pinimg.com/236x/ee/49/1d/ee491d8792b0546bc4255fb55a0b789e.jpg",
    ],
    category: "Nature",
    quantity: 10,
  },
  {
    images: [
      "https://i.pinimg.com/236x/ee/49/1d/ee491d8792b0546bc4255fb55a0b789e.jpg",
      "https://i.pinimg.com/736x/2c/08/97/2c0897ffee55e0eeb3c9174303808ec6.jpg",
      "https://i.pinimg.com/736x/f8/9e/65/f89e65c11e5f87d24bbf38e67d3a91a1.jpg",
    ],
    category: "Nature",
    quantity: 10,
  },
  {
    images: [
      "https://i.pinimg.com/236x/ee/49/1d/ee491d8792b0546bc4255fb55a0b789e.jpg",
      "https://i.pinimg.com/736x/2c/08/97/2c0897ffee55e0eeb3c9174303808ec6.jpg",
      "https://i.pinimg.com/736x/f8/9e/65/f89e65c11e5f87d24bbf38e67d3a91a1.jpg",
    ],
    category: "Nature",
    quantity: 10,
  },
  {
    images: [
      "https://i.pinimg.com/236x/ee/49/1d/ee491d8792b0546bc4255fb55a0b789e.jpg",
      "https://i.pinimg.com/736x/f8/9e/65/f89e65c11e5f87d24bbf38e67d3a91a1.jpg",
      "https://i.pinimg.com/736x/2c/08/97/2c0897ffee55e0eeb3c9174303808ec6.jpg",
    ],
    category: "Nature",
    quantity: 10,
  },
  {
    images: [
      "https://i.pinimg.com/736x/2c/08/97/2c0897ffee55e0eeb3c9174303808ec6.jpg",
      "https://i.pinimg.com/236x/ee/49/1d/ee491d8792b0546bc4255fb55a0b789e.jpg",
      "https://i.pinimg.com/736x/f8/9e/65/f89e65c11e5f87d24bbf38e67d3a91a1.jpg",
    ],
    category: "Nature",
    quantity: 10,
  },
];

function CollectionsPage() {
  const { userId } = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { data, isError, isLoading, error } = useGetAllCollectionsQuery(userId);

  const { showModal } = useModal();

  const collections = data?.collections || [];

  return (
    <section className="relative container mx-auto flex max-w-screen flex-col items-center justify-center space-y-4">
      <button
        onClick={() => showModal(<ModalPin collections={collections} userId={userId} />)}
        className="absolute top-0 right-0"
      >
        Create Pin
      </button>
      <h1 className="mt-5 bg-[url('/gradiend-bg@2x.png')] bg-cover bg-clip-text bg-center bg-no-repeat text-center text-6xl font-bold text-transparent">
        Collections
      </h1>
      <p>
        Explore the world through collections of beatiful <br /> photos free to
        use under the
        <span className="pl-1 font-bold underline">Unsplash License</span>.
      </p>
      <div className="mt-5 grid w-full grid-cols-3 gap-x-4 gap-y-5 min-[1340px]:mx-10 lg:container">
        {isLoading && <p>loading ..</p>}
        {data && (
          <>
            {collections.length === 0 && (
              <AddCollectionCard key="add-first" openModal={handleModal} />
            )}

            {collections.map(({ id, name, quantity, pins }, index) => (
              <React.Fragment key={id}>
                {index === 2 && (
                  <AddCollectionCard key="add-middle" openModal={handleModal} />
                )}
                <CollectionCard
                  category={name}
                  quantity={quantity}
                  images={pins}
                />
              </React.Fragment>
            ))}

            {collections.length > 0 && collections.length < 3 && (
              <AddCollectionCard key="add-end" openModal={handleModal} />
            )}
          </>
        )}
      </div>
      {openModal && (
        <ModalCollection isOpen={openModal} onClose={handleCloseModal} />
      )}
    </section>
  );
}
export default CollectionsPage;
