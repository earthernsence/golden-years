"use client";

import { useRouter } from "next/navigation";

interface UserPageProps {
  username: string
}

const UserPage = ({ params }: { params: UserPageProps }) => {
  const router = useRouter();
  return (
    <div>User page for {params.username}</div>
  );
};

export default UserPage;