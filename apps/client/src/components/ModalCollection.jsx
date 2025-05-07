import { useDispatch, useSelector } from 'react-redux';
import { collectionApi, useCreateCollectionMutation } from '../redux/services/collection-api';
import { useState } from 'react';
import { data, useParams } from 'react-router';
import { toast } from 'sonner';

export const ModalCollection = ({ isOpen, onClose }) => {
  const { user } = useSelector(state => state.auth);
  //   const dispatch = useDispatch();
  const { userId } = useParams();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [createCollection, { isLoading, isError }] = useCreateCollectionMutation();
  if (!isOpen) return null;

  const handleChange = ({ target }) => {
    setTitle(target.value);
  };

  const handleSaveClick = async () => {
    if (title.length > 2) {
      if (userId == user.id) {
        try {
          const result = await createCollection({
            userId: user.id,
            title,
            isPublic,
          }).unwrap();

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
      <div className="relative z-10 flex h-auto w-[630px] flex-col items-center justify-between gap-y-3 rounded-md bg-white p-5 shadow-lg">
        <h3 className="text-xl font-semibold">Add Collection</h3>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          className="w-full rounded-sm border border-gray-300 p-4"
          placeholder="Collection Title"
        />

        <div className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Visibilidad de la colección:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{isPublic ? 'Pública' : 'Privada'}</span>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${isPublic ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className="sr-only">Toggle visibility</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {isError && <p className="text-red-500">Error al crear una colección</p>}

        <div className="flex gap-x-5 mt-4">
          <button
            disabled={isLoading || title.length < 3}
            onClick={handleSaveClick}
            className="cursor-pointer rounded-sm bg-gray-200 px-7 py-2 font-semibold hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Save'}
          </button>
          <button className="active:bg-primary-dark cursor-pointer rounded-sm bg-transparent px-7 py-2 font-semibold" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
