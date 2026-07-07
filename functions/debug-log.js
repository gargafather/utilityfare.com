export async function onRequestPost(context) {
  const body = await context.request.text().catch(() => '');
  console.log('[DEBUG]', body);
  return new Response('ok', {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }
  });
}
