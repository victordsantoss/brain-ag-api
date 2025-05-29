import { Culture } from '../../../../../database/entities/culture.entity';
import { IRegisterCultureRequestDto } from '../../../dtos/culture/register.request.dto';

export interface IRegisterCultureService {
  perform(cultureData: IRegisterCultureRequestDto): Promise<Culture>;
}
