import { auth } from "@/auth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context);
  if (session) {
  }

  return { props: { session } };
};
