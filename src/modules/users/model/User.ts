import { v4 as uuidV4 } from "uuid";

class User {
  public id = uuidV4();
  public name: string;
  public email: string;
  public admin = false;
  public created_at = new Date();
  public updated_at: Date;
}

export { User };