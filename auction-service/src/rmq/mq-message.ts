import {
  MessageHandlerErrorBehavior,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';

interface Params {
  exchange: string;
  service: string;
  cmd: string;
  type: 'rpc' | 'sub';
}

export function MQMessage({ exchange, service, cmd, type }: Params): any {
  const routingKey = service + '.cmd.' + cmd;
  const queue = service + '-' + cmd.replace('.', '-').toLowerCase() + '-queue';

  const Handler = type === 'rpc' ? RabbitRPC : RabbitSubscribe;

  return Handler({
    exchange,
    routingKey: routingKey,
    queue: queue,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  });
}
