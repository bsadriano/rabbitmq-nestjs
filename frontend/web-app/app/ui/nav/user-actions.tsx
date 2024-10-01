"use client";

import { logout } from "@/app/actions/auth.actions";
import { useParamsStore } from "@/app/hooks/useParamsStore";
import { PowerIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect } from "react";
import { AiFillCar, AiFillTrophy } from "react-icons/ai";
import { HiCog, HiUser } from "react-icons/hi2";

interface Props {
  userName: string;
}

export default function UserActions({ userName }: Props) {
  const setParams = useParamsStore((state) => state.setParams);
  const router = useRouter();
  const pathname = usePathname();

  function setWinner() {
    setParams({ winner: userName, seller: undefined });
    if (pathname != "/") router.push("/");
  }

  function setSeller() {
    setParams({ seller: userName, winner: undefined });
    if (pathname != "/") router.push("/");
  }

  const [errorMessage, formAction, isPending] = useActionState(
    logout,
    undefined
  );

  const { data: session, status } = useSession();

  const logoutUser = useCallback(() => {
    const accessToken = session?.user?.accessToken || undefined;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
      // this comes from your .env file, e.x. http://localhost:3000 where your nextjs app runs
      method: "POST",
      body: JSON.stringify({ accessToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        /* send log to the Sentry if the endpoint fails
            if (!data.success)
                notifySentry("Could not log out!")
             */
      })
      .catch((error) => {
        console.log(error);
        /* send log to the Sentry if an error occurs
            notifySentry(error)
             */
      })
      .finally(async () => {
        // after logout, we redirect user to the login page
        await signOut({ callbackUrl: `${window.location.origin}/login` });
      });
  }, [session]);

  useEffect(() => {
    if (
      session?.error &&
      ["AccessTokenError", "RefreshTokenError"].includes(session.error)
    ) {
      // force the user to log out if the session has AccessTokenError
      logout();
    }
  }, [session, logoutUser]);

  return (
    <Dropdown inline label={`Welcome ${userName}`}>
      <DropdownItem icon={HiUser} onClick={setSeller}>
        My Auctions
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy} onClick={setWinner}>
        Auctions won
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        <Link href="/auctions/create">Sell my car</Link>
      </DropdownItem>
      <DropdownItem icon={HiCog}>
        <Link href="/session">Session (dev only!)</Link>
      </DropdownItem>
      <DropdownDivider />
      <form action={formAction}>
        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </Dropdown>
  );
}
