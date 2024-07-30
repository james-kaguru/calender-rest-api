export interface RequestWithUser {
  user: {
    sub: number;
    username: string;
  };
}
