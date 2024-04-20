import { doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, collection, orderBy, query } from 'firebase/firestore';
import { db } from "../firebase";

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
    .replace(/^-+|-+$/g, "");
}

export async function fetchDocument(collectionName, documentId, callback) {
  console.log("Fetching Location:", collectionName, documentId);

  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Got Location:", docSnap.data());
    callback(docSnap.data());
  } else {
    console.log("No such document!", collectionName, documentId);
  }
}