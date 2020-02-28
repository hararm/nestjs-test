import {Controller, Get, Logger, Param} from '@nestjs/common';
import {GroupRepositoryService} from '../repositories/group.repository.service';

@Controller('clinics')
export class ClinicsController {
    private logger = new Logger('ClinicsController');

    constructor(private groupsRepository: GroupRepositoryService) {
    }

    @Get(':clinicName')
    async findGroupByClinicName(@Param('clinicName') clinicName: string) {
        this.logger.verbose(`Retrieve groups by the Clinic Name: ${clinicName}`);
        return await this.groupsRepository.findGroupByClinicName(clinicName);
    }
}
