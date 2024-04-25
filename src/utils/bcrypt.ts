import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export async function hashString(password: string): Promise<string> {
  return await bcrypt.hash(password, saltOrRounds);
}

export async function compareHash(str: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(str, hash);
}
