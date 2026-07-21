export function formatDate(
    date: string,
    options?: Intl.DateTimeFormatOptions
  ) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options,
      }
    ).format(new Date(date));
  }