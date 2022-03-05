import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }): User[] {
    const user = this.usersRepository.findById(user_id);

    if (!user.admin) {
      throw new Error('Not allowed');
    }
    
    return this.usersRepository.list();
  }
}

export { ListAllUsersUseCase };

