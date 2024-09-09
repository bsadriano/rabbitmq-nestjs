"use client";

import { logout } from "@/app/actions/authActions";
import { signOut } from "@/auth";
import { PowerIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { AiFillCar, AiFillTrophy } from "react-icons/ai";
import { HiCog, HiUser } from "react-icons/hi2";

const links = [
  {
    icon: HiUser,
    href: "/",
    label: "My Auction",
  },
  {
    icon: AiFillTrophy,
    href: "/",
    label: "Auctions won",
  },
  {
    icon: AiFillCar,
    href: "/",
    label: "Sell my car",
  },
  {
    icon: HiCog,
    href: "/session",
    label: "Session (dev only!)",
  },
];

interface Props {
  userName: string;
}

export default function UserActions({ userName }: Props) {
  const [errorMessage, formAction, isPending] = useActionState(
    logout,
    undefined
  );

  return (
    <Dropdown inline label={`Welcome ${userName}`}>
      {links.map(({ label, href, icon: Icon }) => (
        <DropdownItem key={label} icon={Icon}>
          <Link href={href}>{label}</Link>
        </DropdownItem>
      ))}
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
