import { Culture } from 'src/database/entities/culture.entity';
import { IRegisterCultureRequestDto } from 'src/modules/harvest/dtos/culture/register.request.dto';

export interface IRegisterCultureService {
  perform(cultureData: IRegisterCultureRequestDto): Promise<Culture>;
}
