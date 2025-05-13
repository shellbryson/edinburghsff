import { doc, getDocs, getDoc, updateDoc, collection, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { list, listAll, ref } from "firebase/storage";
import { db, storage } from "../firebase";

export function imageURL(filename, size) {
  if (!filename) return null;

  const extension = filename.split('.').pop();
  let newFilename = '';

  switch (size) {
    case 'icon':
      newFilename = filename.replace(`.${extension}`, `_32x32.${extension}`);
      break;
    case 'thumb':
      newFilename = filename.replace(`.${extension}`, `_100x100.${extension}`);
      break;
    case 'medium':
      newFilename = filename.replace(`.${extension}`, `_300x300.${extension}`);
      break;
    case 'large':
      newFilename = filename.replace(`.${extension}`, `_800x800.${extension}`);
      break;
    default:
      newFilename = filename.replace(`.${extension}`, `_800x800.${extension}`);
  }

  return newFilename;
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-$/, ""); // Ensure no trailing hyphen remains
}

// Get map location index
export async function fetchLocationsForMapDisplay(callback) {
  const docRef = doc(db, "settings", "index_pins");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const pins = data.pins.map((pin) => ({
      ...pin,
      hidden: false,
      focus: false
    }));
    callback(pins);
  } else {
    console.log("Could not load index_pins from settings collection.");
  }
}

// Single document fetch
export async function fetchDocument(collectionName, documentId, callback) {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  console.log("Fetching Document:", collectionName, documentId);
  if (docSnap.exists()) {
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development") {
      console.log("Document data:", docSnap.data());
    }
    callback(docSnap.data());
  } else {
    console.log("No such document!", collectionName, documentId);
  }
}

// Multiple documents fetch
export async function fetchDocuments(collectionName, orderOn, callback) {
  const q = query(collection(db, collectionName), orderBy(orderOn.field, orderOn.mode));
  const list = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push({
      ...doc.data(),
      id: doc.id,
      display: true,
    });
  });
  if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development") {
    console.log("Document data:", list);
  }
  callback(list);
}

// Create a map pin index
export async function updateMapLocationsIndex(places, user, callback) {
  try {
    const l = doc(db, "settings", "index_pins");
    const newPlaces = [];
    places.forEach((pin) => {
      newPlaces.push({
        name: pin.title,
        name_short: pin?.title_short ? pin.title_short : pin.title,
        show: pin?.show || true,
        featured: pin?.featured || false,
        id: pin.id,
        lat: pin.lat,
        lng: pin.lng,
        tags: pin.tags || "",
      })
    });
    newPlaces.sort((a, b) => a.name.localeCompare(b.name));
    const data = {
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      },
      pins: newPlaces,
    }
    await updateDoc(l, data);
    if (callback) callback(data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Fetch images from Firebase Storage with pagination
export async function fetchImagesWithPagination(collectionName, pageSize, lastVisibleDoc, callback) {
  try {
    const q = lastVisibleDoc
      ? query(
          collection(db, collectionName),
          orderBy("createdAt", "desc"),
          startAfter(lastVisibleDoc),
          limit(pageSize)
        )
      : query(
          collection(db, collectionName),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );

    const querySnapshot = await getDocs(q);
    const images = [];
    let newLastVisibleDoc = null;

    querySnapshot.forEach((doc) => {

      console.log("Image Document:", doc.id);


      const data = doc.data();
      images.push({
        id: doc.id,
        ...data,
      });
    });

    if (!querySnapshot.empty) {
      newLastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    callback({
      images,
      lastVisibleDoc: newLastVisibleDoc,
    });
  } catch (error) {
    console.error("Error fetching images from Firestore collection:", error);
  }
}
