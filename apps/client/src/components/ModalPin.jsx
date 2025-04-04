import { useEffect, useState } from "react";
import { useModal } from "../hooks/useModal";
import { useCreatePinMutation } from "../redux/services/pin-api";

function ModalPin({ collections, userId }) {

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    collectionId: "",
    pin: null,
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    collectionId: "",
    pin: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [createPin, { data, error, isLoading }] = useCreatePinMutation();
  const { title, description, collectionId } = formState;
  const { hideModal } = useModal();
  const onInputChange = ({ target }) => {
    const { name, value } = target;

    setFormState((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const onFileChange = ({ target }) => {
    const file = target.files[0];

    if (file) {
      const MAX_SIZE_MB = 30;
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];

      if (!validTypes.includes(file.type)) {
        setFormErrors(p => ({ ...p, pin: 'El archivo debe ser una imagen' }));
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFormErrors(p => ({ ...p, pin: 'El archivo es muy grande' }));
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormState(p => ({ ...p, pin: file }));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [imagePreview])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formErrors });



    const { pin, ...textType } = formState;

    const isValid = Object.values(textType).every((value) => {
      if (value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    });

    if (!isValid) return;
    if (!pin) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("collectionId", collectionId);

    formData.append("file", pin)

    const result = await createPin({ userId, formData }).unwrap();

    if (result && result.message === 'Success') {
      hideModal();
    }


  }



  return (
    <div className="relative h-96 w-4xl bg-white">
      <button
        onClick={hideModal}
        className="bg-primary-dark text-darkness texz t-sm absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold"
      >
        X
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col py-4 m-5">
        <label>Title</label>
        <input
          className="border border-gray-400 p-3"
          type="text"
          name="title"
          value={title}
          onChange={onInputChange}
        />
        <label>Descripcion</label>
        <input
          className="border border-gray-400 p-3"
          type="text"
          name="description"
          value={description}
          onChange={onInputChange}
        />
        <select
          name="collectionId"
          value={collectionId}
          onChange={onInputChange}
        >
          <option value="">Selecciona una colección</option>
          {collections.length === 0 ? (
            <option disabled>No hay colecciones</option>
          ) : (
            collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))
          )}
        </select>
        <label>Add pin</label>
        <input
          className="border border-gray-400 p-3"
          type="file"
          accept="image/*"
          onChange={onFileChange}

        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-40 object-cover"
            />
          </div>
        )}
        {formErrors.pin && (
          <p className="text-red-500 text-sm mt-1">{formErrors.pin}</p>
        )}
        <button disabled={isLoading} className="p-4 bg-primary-dark m-4" type="submit">send</button>
      </form>
    </div>
  );
}
export default ModalPin;
