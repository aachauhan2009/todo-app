import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const showErrorToast = (err: AxiosError, defaultMessage = "") => {
    toast.error(typeof err?.response?.data === "string" ? err?.response?.data as string : defaultMessage);

}