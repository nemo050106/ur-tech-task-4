import UserCard from "@/elements/UserCard";
import { getUserData } from "@/lib/users";
import { User } from "@/types/types";
import React from "react";

export default async function Users() {
  const userData = await getUserData();

  return (
    <div>
      <div>all users :</div>
      <div className="grid grid-cols-3 gap-2  ">
        {userData.map((user : User) => (
          <UserCard user ={user} key={user.id}></UserCard>
        ))}
      </div>
    </div>
  );
}
