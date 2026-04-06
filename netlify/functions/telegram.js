exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405 };
    const update = JSON.parse(event.body);
    const msg = update.message;
    if (!msg || !msg.text) return { statusCode: 200 };
    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const TOKEN = '8692314375:AAF7mZ-pVUzEibb6z66J1Mb61wzAzwN4FLQ';
    const MY_ID = '1484010221';
    
    let replyText = '';
    if (text === 'STG1_SQL_WIN') {
        replyText = `✅ Stage 1 verified!\nUnlock code for Stage 2: UNLOCK2:7H3_D4RK\nSend this via the 🔒 icon in main page.`;
    } 
    else if (text === 'STG2_PUZZLES_HAK') {
        replyText = `✅ Stage 2 verified!\nUnlock code for Stage 3: UNLOCK3:0V3RL04D\nGood luck final stage.`;
    }
    else if (text === 'STG3_PHISH_MASTER') {
        replyText = `🏆 You passed the third stage! Now choose: send Done-T-Test or Follow-T-Test.`;
    }
    else if (text === 'Done-T-Test') {
        replyText = `You completed the basic test. Your name will be recorded. Thank you.`;
    }
    else if (text === 'Follow-T-Test') {
        replyText = `⚠️ You chose the extreme path. Harder challenges incoming... (simulated)`;
    }
    else {
        replyText = `Send the completion code you got from each stage to receive next unlock.`;
    }
    
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: replyText })
    });
    return { statusCode: 200 };
};
