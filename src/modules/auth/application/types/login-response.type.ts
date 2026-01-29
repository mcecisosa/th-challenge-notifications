export type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
};
