import "server-only";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { error: { message: error.message } },
      { status: error.status },
    );
  }
  // Do not serialize driver errors: they may contain connection credentials.
  console.error(
    "Books API request failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return Response.json(
    {
      error: {
        message: "교재 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      },
    },
    { status: 500 },
  );
}
