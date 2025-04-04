import {
  addPinCollectionByPinId,
  createCollection,
  getAllCollectionByUser,
  getCollectionsByTitle,
} from "../services/collection-service.js";

export const getCollection = async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "need field title" });

  const collection = await getCollectionsByTitle(title);

  res.status(200).json({ ok: 1, data: collection });
};

export const createCollections = async (req, res) => {
  const { title } = req.body;
  const { id } = req.user;

  console.log(title);
  if (!title) return res.status(400).json({ message: "need field title" });

  const collection = await createCollection(title, id);

  if (!collection)
    return res.status(500).json({ message: "no se pudo crear una collecion" });

  res.status(200).json({ message: "collecion creada", data: collection });
};

export const getAllCollectionsByUser = async (req, res) => {
  const { id } = req.params;

  /* Podria verificar el id que se envia y el id del jwt, para enviar más datos, como collections privados privados */

  try {
    const collectionsList = await getAllCollectionByUser(id);

    const mappedList = collectionsList.map((c) => {
      return {
        ...c,
        pins: c.pins.map((p) => p.pin),
      };
    });

    return res.status(200).json({ collections: mappedList });
  } catch (error) {
    res.status(500).json({ error: error, message: error.message });
  }
};

export const addPinToCollection = async (req, res) => {
  const { collectionId, pinId } = req.params;

  const { id } = req.user;

  try {
    const result = await addPinCollectionByPinId(collectionId, pinId, id);

    res.status(201).json({
      message: "Pin agregado correctamente a la colección",
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
