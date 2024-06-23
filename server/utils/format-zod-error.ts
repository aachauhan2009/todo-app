import { ZodError } from "zod";
import { ErrorMessageOptions, generateErrorMessage } from "zod-error";

export const formatZodError = (err: ZodError) => {
    const options: ErrorMessageOptions = {
        delimiter: {
            error: ' 🔥 ',
        },
        code: {
            enabled: false
        },
        path: {
            enabled: false,
        },
        message: {
            enabled: true,
            label: null
        }
    };
    return generateErrorMessage(err.issues, options);
}