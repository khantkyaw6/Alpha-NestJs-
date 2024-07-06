import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static saltOrRound = 10;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltOrRound);
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
