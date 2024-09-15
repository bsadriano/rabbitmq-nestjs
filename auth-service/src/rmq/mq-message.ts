import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

export function MQMessage(exchange: string, service: string, cmd: string): any {
  const routingKey = service + '.cmd.' + cmd;
  const queue = service + '-' + cmd.replace('.', '-').toLowerCase() + '-queue';

  return RabbitSubscribe({
    exchange,
    routingKey: routingKey,
    queue: queue,
  });
}
