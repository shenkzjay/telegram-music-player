import crypto from "node:crypto";

/**
 * Validates the data received from the Telegram Web App.
 * @param initData The raw initData string from the Telegram Web App.
 * @param botToken The Telegram bot token.
 * @returns { user: any } | null
 */
export function validateTelegramInitData(initData: string, botToken: string) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    const dataCheckString = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");

    const secretKey = crypto
        .createHmac("sha256", "WebAppData")
        .update(botToken)
        .digest();

    const calculateHash = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex");

    if (calculateHash === hash) {
        const userString = urlParams.get("user");
        if (userString) {
            try {
                return JSON.parse(userString);
            } catch (e) {
                return null;
            }
        }
    }

    return null;
}
