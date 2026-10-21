type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const apiOrigin = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://smartstore-vqsc.onrender.com"
).replace(/\/+$/, "");

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const target = new URL(
    `/api/${path.map((segment) => encodeURIComponent(segment)).join("/")}`,
    apiOrigin,
  );
  target.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("host");
  headers.delete("origin");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("connection");
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
