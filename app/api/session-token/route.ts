import { Nango } from '@nangohq/node';

const secretKey = process.env.NANGO_SECRET_KEY!;
const nango = new Nango({ secretKey });

export async function POST(request: Request) {
    const { data } = await nango.createConnectSession({
        tags: { end_user_id: '4de64924-07fc-4e02-bdc7-4fc45d24f0a7' }
    });

    return new Response(JSON.stringify({ sessionToken: data.token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
