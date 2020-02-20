import {Controller, Get, Logger, Param} from '@nestjs/common';
import {GroupRepository} from '../repositories/group.repository';

@Controller('clinics')
export class ClinicsController {
    private logger = new Logger('ClinicsController');

    constructor(private groupsRepository: GroupRepository) {
    }

    @Get(':clinicName')
    async findGroupByClinicName(@Param('clinicName') clinicName: string) {
        this.logger.verbose(`Retrieve groups by the Clinic Name: ${clinicName}`);
        return await this.groupsRepository.findGroupByClinicName(clinicName);
    }
}
