import { getFullName } from '@bsadriano/rmq-nestjs-lib';
import { Expose, Transform } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Transform(({ obj }: { obj: User }) =>
    getFullName(obj.firstName, obj.lastName),
  )
  name: string;
}
