import { useDispatch, useSelector } from 'react-redux';
import { collectionApi, useCreateCollectionMutation } from '../redux/services/collection-api';
import { useState } from 'react';
import { data, useParams } from 'react-router';
import { toast } from 'sonner';

export const ModalCollection = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { user } = useSelector(state => state.auth);
  //   const dispatch = useDispatch();
  const { userId } = useParams();
  const [title, setTitle] = useState('');

  const handleChange = ({ target }) => {
    setTitle(target.value);
  };

  const [createCollection, { isLoading, isError }] = useCreateCollectionMutation();

  const handleSaveClick = async () => {
    if (title.length > 2) {
      if (userId == user.id) {
        try {
          const result = await createCollection({
            userId: user.id,
            title,
          }).unwrap();
          console.log(result);
          //   dispatch(
          //     collectionApi.util.invalidateTags([
          //       { type: "Collection", id: userId },
          //     ]),
          //   );
          // console.log("Collection created:", result);

          const nameCollection = result.data?.name;

          toast.success(`collection created successfully ${nameCollection}`);
          onClose();
        } catch (error) {
          toast.error('Error creating a collection');
          console.error('Error al crear la colección:', error);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-secondary absolute inset-0 opacity-55"></div>
      <div className="relative z-10 flex h-[210px] w-[630px] flex-col items-center justify-between gap-y-3 rounded-md bg-white p-5 shadow-lg">
        <h3 className="text-xl font-semibold">Add Collection</h3>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          className="w-full rounded-sm border border-gray-300 p-4"
          placeholder="Collection Title"
        />
        {isError && <p>Error al crear una collecion</p>}
        <div className="flex gap-x-5">
          <button
            disabled={isLoading}
            onClick={handleSaveClick}
            className="cursor-pointer rounded-sm bg-gray-200 px-7 py-2 font-semibold hover:bg-gray-300 active:bg-gray-400"
          >
            Save
          </button>
          <button className="active:bg-primary-dark cursor-pointer rounded-sm bg-transparent px-7 py-2 font-semibold" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
