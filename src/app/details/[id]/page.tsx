import { getUserById } from "@/lib/userDetails";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>City: {user.address?.city}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}