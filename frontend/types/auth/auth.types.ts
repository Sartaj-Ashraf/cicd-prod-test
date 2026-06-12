export type RegisterUser = {
  email: string
  phoneNumber: string
  name: string
}

export type LoginUser = {
  email: string
  password: string
}
 export type MeResponse = {
  user: {
    userId: string;
    name: string;
    email: string;
    role: string;
    provider:"local" | "google",
    phoneNumber?: string;
    badReviewRedirectEnabled?: boolean;
    activeSubscription:string,
    hasEverSubscribed:boolean

  };
};