
import type { User } from "@/types/types";

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json() as Promise<User>;
}