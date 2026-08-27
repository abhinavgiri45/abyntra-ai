export async function onRequest(context) {
  const url = new URL(context.request.url);
  const subpath = url.pathname.replace(/^\/api\/replicate/, '');
  const targetUrl = `https://api.replicate.com/v1${subpath}${url.search}`;

  const headers = new Headers(context.request.headers);
  headers.set('Origin', 'https://api.replicate.com');
  headers.delete('host');

  return fetch(targetUrl, {
    method: context.request.method,
    headers,
    body: context.request.body
  });
}
