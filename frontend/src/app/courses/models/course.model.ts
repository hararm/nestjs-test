import {ICourse} from '../../../../../shared/course';


export class Course implements ICourse {
  _id: string;
  category: string;
  courseListIcon: string;
  description: string;
  iconUrl: string;
  lessonsCount: number;
  promo: boolean;
  seqNo: number;
  url: string;
}
