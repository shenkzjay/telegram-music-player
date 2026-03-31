const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendMessage(chatId: string | number, text: string) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
    return response.json();
}

export async function setWebhook(url: string, secretToken: string) {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, secret_token: secretToken }),
    });
    return response.json();
}
