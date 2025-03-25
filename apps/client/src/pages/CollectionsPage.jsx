import { useState } from "react";
import AddCollectionCard from "../components/AddCollectionCard";
import CollectionCard from "../components/CollectionCard";

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
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <section className="container mx-auto flex max-w-screen flex-col items-center justify-center space-y-4">
      <h1 className="mt-5 bg-[url('/gradiend-bg@2x.png')] bg-cover bg-clip-text bg-center bg-no-repeat text-center text-6xl font-bold text-transparent">
        Collections
      </h1>
      <p>
        Explore the world through collections of beatiful <br /> photos free to
        use under the
        <span className="pl-1 font-bold underline">Unsplash License</span>.
      </p>
      <div className="mt-5 grid w-full grid-cols-3 gap-x-4 gap-y-5 min-[1340px]:mx-10 lg:container">
        {prueba.map((collection, index) =>
          index === 2 ? (
            <AddCollectionCard key={index} openModal={handleOpenModal} />
          ) : (
            <CollectionCard key={index} {...collection} />
          ),
        )}
      </div>
      <Modal isOpen={openModal} onClose={handleCloseModal} />
    </section>
  );
}
export default CollectionsPage;

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-secondary absolute inset-0 opacity-55"></div>
      <div className="relative z-10 flex h-[210px] w-[630px] flex-col items-center justify-between gap-y-3 rounded-md bg-white p-5 shadow-lg">
        <h3 className="text-xl font-semibold">Add Collection</h3>
        <input
          type="text"
          className="w-full rounded-sm border border-gray-300 p-4"
          placeholder="Collection Title"
        />
        <div className="flex gap-x-5">
          <button className="cursor-pointer rounded-sm bg-gray-200 px-7 py-2 font-semibold hover:bg-gray-300 active:bg-gray-400">
            Save
          </button>
          <button
            className="active:bg-primary-dark cursor-pointer rounded-sm bg-transparent px-7 py-2 font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
