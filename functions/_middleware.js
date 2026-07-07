const PIXEL_ID = 'D96GPTRC77U5KEVKJ74G';
const TT_API   = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

async function firePixel(request, accessToken) {
  const url = new URL(request.url);
  const ip  = request.headers.get('cf-connecting-ip')
            || request.headers.get('x-forwarded-for')
            || '';
  const ua  = request.headers.get('user-agent') || '';
  const ref = request.headers.get('referer')    || '';

  const body = {
    event_source:    'web',
    event_source_id: PIXEL_ID,
    data: [{
      event:      'PageView',
      event_time: Math.floor(Date.now() / 1000),
      user: { ip, user_agent: ua },
      page: { url: url.href, referrer: ref },
      properties: {},
    }],
  };

  return fetch(TT_API, {
    method:  'POST',
    headers: { 'Access-Token': accessToken, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url    = new URL(request.url);
  const accept = request.headers.get('accept') || '';

  // Only fire on HTML page loads, not assets (js, css, images, etc.)
  const isPage = request.method === 'GET'
    && accept.includes('text/html')
    && !url.pathname.match(/\.[a-z0-9]+$/i);

  const response = await next();

  if (isPage && response.status === 200) {
    const token = env.TT_ACCESS_TOKEN;
    context.waitUntil(firePixel(request, token).catch(() => {}));
  }

  return response;
}
