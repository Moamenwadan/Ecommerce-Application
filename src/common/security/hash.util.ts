import * as bycrypt from 'bcrypt';
import { config } from 'dotenv';
config();
export const hash = function (
  text: string,
  saltRound: number = Number(process.env.SALT_ROUND),
) {
  return bycrypt.hash(text, saltRound);
};
export const compareHash = function (text: string, hash: string) {
  return bycrypt.compareSync(text, hash);
};
