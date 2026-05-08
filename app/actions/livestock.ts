"use server"

import { revalidatePath } from "next/cache"

// This is where you would normally import Prisma to save to a database
// e.g., import { db } from "@/lib/db"

export async function addAnimal(formData: FormData) {
  // Capture the data from the form
  const tagId = formData.get("tagId")
  const species = formData.get("species")
  const breed = formData.get("breed")
  const weight = formData.get("weight")

  // Logic: Print to console for now (Real DB logic goes here)
  console.log("Saving to SmartFarm DB:", { tagId, species, breed, weight })

  // Validation: Check if tagId exists
  if (!tagId) return { error: "Ear tag ID is required" }

  /* 
  Real Prisma Code would look like this:
  await db.animal.create({
    data: { tagId, species, breed, weight: parseFloat(weight as string) }
  })
  */

  // Refresh the page so the new animal appears in the table
  revalidatePath("/dashboard/livestock")
  
  return { success: true }
}