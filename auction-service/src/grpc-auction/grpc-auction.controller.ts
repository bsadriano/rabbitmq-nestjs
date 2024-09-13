import { Controller, Logger } from '@nestjs/common';
import {
  GetAuctionRequest,
  GrpcAuctionController as GrpcAuctionControllerInterface,
  GrpcAuctionControllerMethods,
  GrpcAuctionResponse,
} from 'proto/auction';
import { Observable } from 'rxjs';
import { GrpcAuctionService } from './grpc-auction.service';

@Controller()
@GrpcAuctionControllerMethods()
export class GrpcAuctionController implements GrpcAuctionControllerInterface {
  private logger = new Logger('GrpcAuctionController');

  constructor(private readonly grpcAuctionService: GrpcAuctionService) {}
  getAuction(
    request: GetAuctionRequest,
  ):
    | Promise<GrpcAuctionResponse>
    | Observable<GrpcAuctionResponse>
    | GrpcAuctionResponse {
    this.logger.log(`Received Grpc Request for auction with id #${request.id}`);

    return this.grpcAuctionService.getAuction(request);
  }
}
