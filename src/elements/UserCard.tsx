import { UserCardProps } from "@/types/types";
import React from "react";
import Button from "./Button";

export default async function UserCard({ user }: UserCardProps) {
  return (
    <div className="w-80 rounded-xl border border-gray-200 bg-white p-6 shadow-md mx-auto">
      <h2 className="mb-3 text-xl font-bold text-gray-800">{user.name}</h2>

      <p className="mb-2 text-sm text-gray-600">Email: {user.email}</p>

      <p className="mb-5 text-sm text-gray-600">City: {user.address.city}</p>

     <Button userId = {user.id}></Button>
    </div>
  );
}
