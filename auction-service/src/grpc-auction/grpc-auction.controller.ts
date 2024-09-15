import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  GrpcAuctionController as GrpcAuctionControllerInterface,
  GrpcAuctionControllerMethods,
  GrpcAuctionResponse,
} from 'proto/auction';
import { Observable } from 'rxjs';
import { GetAuctionRequestDto } from './dto/get-auction-request.dto';
import { GrpcAuctionService } from './grpc-auction.service';

@Controller()
@GrpcAuctionControllerMethods()
export class GrpcAuctionController implements GrpcAuctionControllerInterface {
  private logger = new Logger('GrpcAuctionController');

  constructor(private readonly grpcAuctionService: GrpcAuctionService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  getAuction(
    request: GetAuctionRequestDto,
  ):
    | Promise<GrpcAuctionResponse>
    | Observable<GrpcAuctionResponse>
    | GrpcAuctionResponse {
    console.log({ request });
    this.logger.log(`Received Grpc Request for auction with id #${request.id}`);

    return this.grpcAuctionService.getAuction(request);
  }
}
