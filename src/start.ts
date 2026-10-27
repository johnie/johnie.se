import { redirect } from "@tanstack/react-router";
import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";

import { REDIRECTS } from "@/lib/redirects";
import { SECURITY_HEADERS } from "@/lib/security-headers";

const redirectMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  const normalizedPath = url.pathname.replace(/\/+$/u, "") || "/";
  const destination = REDIRECTS.get(normalizedPath);

  if (destination) {
    throw redirect({ href: destination, statusCode: 308 });
  }

  if (url.pathname !== normalizedPath) {
    throw redirect({
      href: `${normalizedPath}${url.search}`,
      statusCode: 308,
    });
  }

  return next();
});

const securityHeadersMiddleware = createMiddleware().server(
  async ({ next }) => {
    // oxlint-disable-next-line node/callback-return -- next resolves a middleware result that must receive headers before returning.
    const result = await next();

    for (const [name, value] of SECURITY_HEADERS) {
      result.response.headers.set(name, value);
    }

    return result;
  }
);

export const startInstance = createStart(() => ({
  requestMiddleware: [
    createCsrfMiddleware({
      filter: (context) => context.handlerType === "serverFn",
    }),
    redirectMiddleware,
    securityHeadersMiddleware,
  ],
}));
