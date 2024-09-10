import { getCurrentUser } from "@/app/actions/auth.actions";
import Logo from "./logo";
import Search from "./search";
import UserActions from "./user-actions";

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 flex justify-between bg-white shadow-md py-5 px-5 items-center text-gray-800">
      <Logo />
      {!!user && (
        <>
          <Search />
          <UserActions userName={user.name!} />
        </>
      )}
    </header>
  );
}
