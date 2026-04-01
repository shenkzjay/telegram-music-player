import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.argv[2]; // e.g. https://your-app.vercel.app/api/telegram/webhook
const SECRET_TOKEN = process.env.SECRET_TOKEN || process.env.WEBHOOK_SECRET;

if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set in .env");
    process.exit(1);
}

if (!WEBHOOK_URL) {
    console.error(" Usage: node scripts/setup-webhook.js <webhook_url>");
    console.error("Example: node scripts/setup-webhook.js https://my-app.vercel.app/api/telegram/webhook");
    process.exit(1);
}

async function setupWebhook() {
    console.log(` Setting up webhook for bot...`);
    console.log(`URL: ${WEBHOOK_URL}`);

    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: WEBHOOK_URL,
            secret_token: SECRET_TOKEN,
            allowed_updates: ["my_chat_member", "channel_post", "message"]
        }),
    });

    const result = await response.json();

    if (result.ok) {
        console.log("Webhook set successfully!");
        console.log(result);
    } else {
        console.error("Failed to set webhook:");
        console.error(result);
    }
}

setupWebhook();
