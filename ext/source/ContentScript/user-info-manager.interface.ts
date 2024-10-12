import { IUserInfo } from "./user-info.interface";

let _users: IUserInfo[] = [];
export const userInfoManager = {
  getUserInfo: (id: string): IUserInfo | undefined => {
    return _users.find((u) => u.id === id);
  },
};
