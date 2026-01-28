export async function onRequestPost({ request, env }) {
    try {
        const { pin } = await request.json();

        // Check against environment variable
        // Fallback to '1234' only if env var is missing (for dev/testing safety) but log warning
        const validPin = env.ADMIN_PIN || '1234';

        if (!env.ADMIN_PIN) {
            console.warn('ADMIN_PIN not set in environment variables. Using default.');
        }

        if (pin === validPin) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: false }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }
}
