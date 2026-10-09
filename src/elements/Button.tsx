
import { ButtonProps } from "@/types/types";
import Link from "next/link";



export default function Button({ userId }: ButtonProps) {
  return (
    <Link
      href={`/details/${userId}`}
      className="block w-fit mx-auto rounded-2xl bg-blue-800 px-4 py-3 text-center text-white transition hover:bg-blue-700"
    >
      View Details
    </Link>
  );
}