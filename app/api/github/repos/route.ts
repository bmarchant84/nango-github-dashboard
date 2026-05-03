import { Nango } from '@nangohq/node';

const secretKey = process.env.NANGO_SECRET_KEY!;
const nango = new Nango({ secretKey });

export async function GET(request: Request) {
    const response = await nango.proxy({
  method: 'GET',
  endpoint: '/user/repos',
  providerConfigKey: 'github-getting-started',
  connectionId: '4de64924-07fc-4e02-bdc7-4fc45d24f0a7'
})
    return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
