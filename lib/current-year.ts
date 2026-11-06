import { createContext, useContext } from "react";

export const CurrentYearContext = createContext<number | null>(null);

export const useCurrentYear = () => {
  const year = useContext(CurrentYearContext);

  if (year === null) {
    throw new Error("Current year requires a request-owned CurrentYearContext");
  }

  return year;
};
