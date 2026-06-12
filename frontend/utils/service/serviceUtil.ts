import axios from "axios";
import { toast } from "sonner";

export const handleError = (error: unknown, showtoast: boolean = true): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message;
    if (showtoast) {
      toast.error(message);
    }
    throw { message };
  }

  if (error instanceof Error) {
    toast.error(error.message);
    throw { message: error.message };
  }

  throw { message: "Something went wrong" };
};
