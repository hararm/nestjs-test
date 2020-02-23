import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupSchema} from './schemas/group.schema';
import {GroupsController} from './controllers/groups.controller';
import {GroupRepository} from './repositories/group.repository';
import {ClinicsController} from './controllers/clinics.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Group', schema: GroupSchema},
        ]),
    ],
    controllers: [
        GroupsController,
        ClinicsController
    ],
    providers: [
       GroupRepository
    ],
    exports: [
        GroupRepository
    ]
})
export class ChatModule {
}
