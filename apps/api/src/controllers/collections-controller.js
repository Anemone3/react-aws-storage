import { ACCESS_JWT_KEY } from "../config/config.js";
import { addPinCollectionByPinId, createCollection, getAllCollectionByUser, getCollectionsByTitle } from "../services/collection-service.js";
import { decodeToken } from "../services/jwt-service.js";
import { getUserByEmail } from "../services/user-service.js";

export const getCollection = async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "need field title" });

  const collection = await getCollectionsByTitle(title);

  res.status(200).json({ ok: 1, data: collection });
};

export const createCollections = async (req, res) => {
  const { title, isPublic = true } = req.body;
  const { id } = req.user;

  console.log(title);
  if (!title) return res.status(400).json({ message: "need field title" });

  const collection = await createCollection(title, id, isPublic);

  if (!collection) return res.status(500).json({ message: "no se pudo crear una collecion" });

  res.status(200).json({ message: "collecion creada", data: collection });
};

export const getAllCollectionsByUser = async (req, res) => {
  const { id } = req.params;
  const authorization = req.headers["authorization"];
  console.log("llegueeeeee");
  let isUser = false;

  if (authorization) {
    const token = authorization.split(" ")[1] || "";
    const payload = decodeToken(token, ACCESS_JWT_KEY);
    console.log("llegueeeeee");
    const userPayload = await getUserByEmail(payload.email);
    if (userPayload.id === id) {
      isUser = true;
    }
  }

  /* Podria verificar el id que se envia y el id del jwt, para enviar más datos, como collections privados privados */

  try {
    const collectionsList = await getAllCollectionByUser(id);

    let collections = isUser ? collectionsList : collectionsList.filter((p) => p.isPublic);
    console.log("isLoged?", isUser);
    const mappedList = collections.map((c) => {
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
