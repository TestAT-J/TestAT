exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const { message } = JSON.parse(event.body);
    const TOKEN = '8692314375:AAF7mZ-pVUzEibb6z66J1Mb61wzAzwN4FLQ';
    const CHAT_ID = '1484010221';
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ ok: data.ok })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message })
        };
    }
};