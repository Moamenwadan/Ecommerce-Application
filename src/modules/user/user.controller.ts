import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/public/public.decorator';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';

@Controller('/user')
export class UserController {
  // @Public()
  @Roles(Role.user, Role.admin)
  @Get('/profile')
  profile() {
    console.log('DONE');
    return 'DOne';
  }
}
