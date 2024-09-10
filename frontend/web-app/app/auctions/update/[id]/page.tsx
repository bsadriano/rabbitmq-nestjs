import { getDetailedViewData } from "@/app/actions/auction.actions";
import Heading from "@/app/components/Heading";
import AuctionForm from "@/app/ui/auctions/auction-form";

interface Props {
  params: { id: string };
}
export default async function Update({ params: { id } }: Props) {
  const data = await getDetailedViewData(id);

  if ("error" in data) {
    return <div>Whoops! Something went wrong</div>;
  }

  return (
    <div className="mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg">
      <Heading
        title="Update your auction"
        subtitle="Please update the details of your car"
      />
      <AuctionForm auction={data} />
    </div>
  );
}
