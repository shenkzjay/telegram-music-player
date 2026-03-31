import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../../prisma/prisma";
import { sendMessage } from "~/utils/bot.server";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // Security check: Telegram sends the secret token in X-Telegram-Bot-Api-Secret-Token
    const secretToken = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (process.env.WEBHOOK_SECRET && secretToken !== process.env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json();

    // 1. Handle bot being added to a channel (my_chat_member)
    if (payload.my_chat_member) {
        const { chat, new_chat_member, from } = payload.my_chat_member;

        // Check if the bot was added as an administrator
        if (new_chat_member.status === "administrator") {
            const tgChatId = chat.id.toString();
            const tgUserId = from.id.toString();

            // Find the user by their Telegram ID
            const user = await prisma.user.findUnique({
                where: { tgId: tgUserId }
            });

            if (user) {
                // Link the channel to the user
                await prisma.channel.upsert({
                    where: { tgChatId },
                    update: { userId: user.id, isActive: true },
                    create: {
                        tgChatId,
                        userId: user.id,
                        isActive: true,
                        isVerified: true
                    }
                });

                await sendMessage(tgUserId, `✅ Channel connected! I'll now sync music from ${chat.title || "your channel"}.`);
            }
        }
        return new Response("OK");
    }

    // 2. Handle new posts in the channel (channel_post)
    if (payload.channel_post) {
        const post = payload.channel_post;

        if (post.audio) {
            const audio = post.audio;
            const tgChatId = post.chat.id.toString();

            // Find the channel in our DB
            const channel = await prisma.channel.findUnique({
                where: { tgChatId }
            });

            if (channel) {
                // Save the song
                await prisma.song.upsert({
                    where: { fileId: audio.file_id },
                    update: {
                        title: audio.title || "Unknown Title",
                        artist: audio.performer || "Unknown Artist",
                        duration: audio.duration || 0,
                    },
                    create: {
                        fileId: audio.file_id,
                        title: audio.title || "Unknown Title",
                        artist: audio.performer || "Unknown Artist",
                        duration: audio.duration || 0,
                        channelId: channel.id
                    }
                });
            }
        }
        return new Response("OK");
    }

    return new Response("OK");
}
