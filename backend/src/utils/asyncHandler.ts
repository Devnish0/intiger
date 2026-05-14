type AsyncHandlerFn<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<unknown> | unknown;

type ErrorWithStatusCode = {
  statusCode?: number;
  message?: string;
};

const asyncHandler = <TArgs extends unknown[]>(fn: AsyncHandlerFn<TArgs>) => {
  return async (...args: TArgs): Promise<void> => {
    try {
      await fn(...args);
    } catch (error: unknown) {
      console.log("ERROR", error);

      const typedError = error as ErrorWithStatusCode;
      const statusCode = typedError.statusCode ?? 500;
      const message = typedError.message ?? "Internal Server Error";

      const maybeResponse = args[1] as
        | {
            status: (code: number) => { json: (body: unknown) => void };
          }
        | undefined;

      if (maybeResponse?.status) {
        maybeResponse.status(statusCode).json({
          success: false,
          message: "from AH: " + message,
        });
        return;
      }

      throw Object.assign(new Error(message), { statusCode });
    }
  };
};

export { asyncHandler };
