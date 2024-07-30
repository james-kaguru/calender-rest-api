export interface RequestWithUser {
  user: {
    sub: string;
    username: string;
  };
}
