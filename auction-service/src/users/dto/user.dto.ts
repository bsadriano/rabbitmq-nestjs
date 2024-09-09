import { Expose, Transform } from 'class-transformer';
import { capitalizeFirstLetter } from 'src/utils/string';
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
  @Transform(
    ({ obj }: { obj: User }) =>
      `${capitalizeFirstLetter(obj.firstName)} ${capitalizeFirstLetter(obj.lastName)}`,
  )
  name: string;
}
