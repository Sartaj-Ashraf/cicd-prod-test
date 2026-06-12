  import customFetch from "@/utils/customFetch"
  import { RegisterUser, LoginUser } from "@/types/auth/auth.types"
  import axios from "axios"
  import { toast } from "sonner"
  import { queryClient } from "@/utils/query-client"
  import { queryKeys } from "@/lib/query-keys"

  type CreditCategory = {
  creditsTotal: number;
  creditsUsed: number;
};

export type CreditsResponse = {
  success: boolean;
  data: {
   analyses:             CreditCategory;
  aiReplies:            CreditCategory;
  totalScans:           CreditCategory;
  aiReviews:            CreditCategory;
  aiAutoReplies:        CreditCategory;
  whatsappMessages:     CreditCategory;
  aiCompetitorAnalysis: CreditCategory; // ← add
  reviewAnalysisVolume: number | null;
  };
}
export const registerUser = async (data: RegisterUser) => {
  try {
    const response = await customFetch.post("/auth/register", data)
    return response.data // { success: true, message: "...", statusCode: 200 | 201 }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
      throw new Error(message)
    }
    if (error instanceof Error) {
      toast.error(error.message)
      throw new Error(error.message)
    }
    throw new Error("Something went wrong")
  }
}
  export const loginUser = async (data: LoginUser) => {
    try {
      const response = await customFetch.post("/auth/login", data)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message

        // toast.error(message)
         throw new Error(message)
      }

      if (error instanceof Error) {
        toast.error(error.message)
        throw new Error(error.message)
      }

      throw new Error("Something went wrong")
    }
  }

  export const logout = async () => {
    try {
      const response = await customFetch.post("/auth/logout")
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message

        // todo navigate user login 
        throw new Error(message)
      }

      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error("Something went wrong")
    }
  }
  export const me = async () => {
    try {
      const response = await customFetch.get("/auth/me")
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message

        throw new Error(message)
      }

      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error("Something went wrong")
    }
  }

  export const setPassword = async (token: string, password: string) => {
    try {
      const response = await customFetch.post(`/auth/set-password/${token}`, {
        password,
      })
      return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (data?.errors?.length) {
        const msg = data.errors.map((item: any) => item.msg).join(", ");
        toast.error(msg);
        throw new Error(msg);
      }

      const message = data?.message || error.message;
      toast.error(message);
      throw new Error(message);
    }

    if (error instanceof Error) {
      toast.error(error.message);
      throw error;
    }

    toast.error("Something went wrong");
    throw new Error("Something went wrong");
  }
  }
  export const forgotPassword = async (email: string) => {
    try {
      const response = await customFetch.patch("/auth/forget-password", { email })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message

        toast.error(message)
        throw new Error(message)
      }

      if (error instanceof Error) {
        toast.error(error.message)
        throw new Error(error.message)
      }

      throw new Error("Something went wrong")
    }
  }

  export const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await customFetch.patch(`/auth/change-password`, {
        oldPassword,
        newPassword,
      })
      return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (data?.errors?.length) {
        const msg = data.errors.map((item: any) => item.msg).join(", ");
        toast.error(msg);
        throw new Error(msg);
      }

      const message = data?.message || error.message;
      toast.error(message);
      throw new Error(message);
    }

    if (error instanceof Error) {
      toast.error(error.message);
      throw error;
    }

    toast.error("Something went wrong");
    throw new Error("Something went wrong");
  }
  }

  export const updateProfile = async (name: string, phoneNumber: string) => {
    try {
      const response = await customFetch.patch(`/users/update-profile`, {
        name,
        phoneNumber,
      });

      const data = response.data;


  queryClient.setQueryData(queryKeys.auth.me, (old: any) => {
    if (!old) {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      return old;
    }

    return {
      ...old,
      user: {
        ...old.user,
        ...data.data,
        userId: data.data._id,
      },
    };
  });
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (data?.errors?.length) {
          const msg = data.errors.map((item: any) => item.msg).join(", ");
          toast.error(msg);
          throw new Error(msg);
        }

        const message = data?.message || error.message;
        toast.error(message);
        throw new Error(message);
      }

      if (error instanceof Error) {
        toast.error(error.message);
        throw error;
      }

      toast.error("Something went wrong");
      throw new Error("Something went wrong");
    }
  };


    export const creditsLeft = async () => {
      try {
        const response = await customFetch.get(`/users/analysis-left`);
        return response.data  as CreditsResponse
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {  
          const data = error.response?.data;

          if (data?.errors?.length) {
            const msg = data.errors.map((item: any) => item.msg).join(", ");
            toast.error(msg);
            throw new Error(msg);
          }

          const message = data?.message || error.message;
          toast.error(message);
          throw new Error(message);
        }

        if (error instanceof Error) {
          toast.error(error.message);
          throw error;
        }

        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    };