import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { SiteConfiguration } from "@/contexts/configuration-context"
import { toast } from "sonner"

export async function saveDesign(
  userId: string,
  design: SiteConfiguration,
): Promise<string> {
  const designsRef = collection(db, "users", userId, "designs")
  const designDoc = design.id ? doc(designsRef, design.id) : doc(designsRef)

  // Remove undefined fields
  const cleanDesign = Object.fromEntries(
    Object.entries({
      ...design,
      id: designDoc.id,
      createdAt: design.createdAt || serverTimestamp(),
    }).filter(([, value]) => value !== undefined),
  )

  await setDoc(designDoc, cleanDesign)

  toast.success("Design saved successfully")

  return designDoc.id
}

export async function loadDesigns(
  userId: string,
): Promise<SiteConfiguration[]> {
  const designsRef = collection(db, "users", userId, "designs")
  const q = query(designsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as SiteConfiguration[]
}

export async function loadDesign(
  userId: string,
  designId: string,
): Promise<SiteConfiguration | null> {
  const designDoc = doc(db, "users", userId, "designs", designId)
  const snapshot = await getDoc(designDoc)

  if (!snapshot.exists()) return null

  return { ...snapshot.data(), id: snapshot.id } as SiteConfiguration
}

export async function deleteDesign(
  userId: string,
  designId: string,
): Promise<void> {
  const designDoc = doc(db, "users", userId, "designs", designId)
  await deleteDoc(designDoc)
}
