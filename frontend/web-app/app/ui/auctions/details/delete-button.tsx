"use client";

import { deleteAuction } from "@/app/actions/auction.actions";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  id: string;
}

export default function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function doDelete() {
    setLoading(true);
    try {
      const res = await deleteAuction(id);
      router.push("/");
      if (res.error) throw res.error;
    } catch (err: any) {
      toast.error(err.status + " " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button color="failure" isProcessing={loading} onClick={doDelete}>
      Delete Auction
    </Button>
  );
}
