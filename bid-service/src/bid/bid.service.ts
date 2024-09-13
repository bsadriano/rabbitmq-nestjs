import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GRPC_AUCTION_SERVICE_NAME, GrpcAuctionClient } from 'proto/auction';
import { Bid } from 'src/schemas/bid.schema';

@Injectable()
export class BidService {
  private grpcAuctionClient: GrpcAuctionClient;
  constructor(
    @Inject('AUCTION_PACKAGE') private clientGrpc: ClientGrpc,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
  ) {}

  onModuleInit() {
    this.grpcAuctionClient = this.clientGrpc.getService<GrpcAuctionClient>(
      GRPC_AUCTION_SERVICE_NAME,
    );
  }

  async placeBid(auctionId: number, amount: number) {
    let auction: any = this.bidModel.findOne({ auctionId });

    if (!auction) {
      // auction =
    }
    // var auction = await DB.Find<Auction>().OneAsync(auctionId);
    // if (auction == null)
    // {
    //     auction = grpcClient.GetAuction(auctionId);
    //     if (auction == null) return BadRequest("Cannot accept bids on this auction at this time");
    // }
    // if (auction.Seller == User.Identity?.Name)
    // {
    //     return BadRequest("You cannot bid on your own item");
    // }
    // if (User.Identity?.Name == null) return Unauthorized();
    // var bid = new Bid()
    // {
    //     Amount = amount,
    //     AuctionId = auctionId,
    //     Bidder = User.Identity.Name
    // };
    // if (auction.AuctionEnd < DateTime.UtcNow)
    // {
    //     bid.BidStatus = BidStatus.Finished;
    // }
    // else
    // {
    //     var highBid = await DB.Find<Bid>()
    //         .Match(a => a.AuctionId == auctionId)
    //         .Sort(b => b.Descending(x => x.Amount))
    //         .ExecuteFirstAsync();
    //     if (highBid != null && amount > highBid.Amount || highBid == null)
    //     {
    //         bid.BidStatus = amount > auction.ReservePrice
    //             ? BidStatus.Accepted
    //             : BidStatus.AcceptedBelowReserve;
    //     }
    //     if (highBid != null && bid.Amount <= highBid.Amount)
    //     {
    //         bid.BidStatus = BidStatus.TooLow;
    //     }
    // }
    // await DB.SaveAsync(bid);
    // await publishEndpoint.Publish(mapper.Map<BidPlaced>(bid));
    // return Ok(mapper.Map<BidDto>(bid));
  }

  getBidsForAuction(auctionId: number) {
    this.bidModel.find({ auctionId });
  }
}
