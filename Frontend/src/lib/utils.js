import axios from "axios";
import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    }
    reader.readAsDataURL(file)
  })

}

export const myErrorRes = (error) => {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  } else {
    toast.error(error.message || "Unexpected error");
  }
}