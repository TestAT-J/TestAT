// netlify/functions/send.js
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { code, chatId } = JSON.parse(event.body);
    const BOT_TOKEN = '8692314375:AAF7mZ-pVUzEibb6z66J1Mb61wzAzwN4FLQ';
    const DEFAULT_CHAT_ID = '1484010221';
    const targetChatId = chatId || DEFAULT_CHAT_ID;

    let replyText = '';
    let unlockCode = '';

    // تحديد الرد بناءً على الكود المرسل
    if (code === 'STG1_SQL_WIN') {
        unlockCode = 'UNLOCK2:7H3_D4RK';
        replyText = `✅ Stage 1 verified!\nUnlock code for Stage 2: <code>${unlockCode}</code>\nSend this via the 🔒 icon on main page.`;
    } 
    else if (code === 'STG2_PUZZLES_HAK') {
        unlockCode = 'UNLOCK3:0V3RL04D';
        replyText = `✅ Stage 2 verified!\nUnlock code for Stage 3: <code>${unlockCode}</code>\nGood luck final stage.`;
    }
    else if (code === 'STG3_PHISH_MASTER') {
        replyText = `🏆 You passed the third stage! Now choose: send "Done-T-Test" or "Follow-T-Test" to this bot.`;
    }
    else if (code === 'Done-T-Test') {
        replyText = `You completed the basic test. Your name will be recorded. Thank you.`;
    }
    else if (code === 'Follow-T-Test') {
        replyText = `⚠️ You chose the extreme path. Harder challenges incoming... (simulated)`;
    }
    else {
        replyText = `Send the completion code you got from each stage to receive next unlock.`;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: targetChatId,
        text: replyText,
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
            body: JSON.stringify({ ok: data.ok, unlockCode: unlockCode, description: data.description })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message })
        };
    }
};
