export async function onRequestGet(context) {
  const ip = context.request.headers.get('cf-connecting-ip') || '';
  const ua = context.request.headers.get('user-agent') || '';
  console.log('[OFFER-HIT] ip=' + ip + ' ua=' + ua.slice(0, 80));

  return new Response(null, {
    status: 302,
    headers: {
      'Location': 'https://www.google.com/',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
