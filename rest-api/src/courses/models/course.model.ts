import {ICourse} from '../../../../shared/course';
import {IsBoolean, IsInt, IsMongoId, IsString} from 'class-validator';

export class Course implements ICourse {
  // tslint:disable-next-line:variable-name
  @IsString()
  @IsMongoId()
  _id: string;
  @IsString() category: string;
  @IsString() courseListIcon: string;
  @IsString() description: string;
  @IsString() iconUrl: string;
  @IsInt()lessonsCount: number;
  @IsBoolean() promo: boolean;
  @IsInt({message: 'seqNo must be numeric'}) seqNo: number;
  @IsString({always: false})url: string;
}
