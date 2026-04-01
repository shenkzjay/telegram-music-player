import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../../prisma/prisma";
import { sendMessage } from "~/utils/bot.server";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // Security check: Telegram sends the secret token in X-Telegram-Bot-Api-Secret-Token
    const secretToken = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    const expectedToken = process.env.SECRET_TOKEN || process.env.WEBHOOK_SECRET;

    if (expectedToken && secretToken !== expectedToken) {
        console.warn("Unauthorized webhook attempt with token:", secretToken);
        return new Response("Unauthorized", { status: 401 });
    }

    let payload;
    try {
        payload = await request.json();
    } catch (e) {
        console.error("Failed to parse webhook payload:", e);
        return new Response("Bad Request", { status: 400 });
    }

    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));

    try {
        // 1. Handle bot being added to a channel (my_chat_member)
        if (payload.my_chat_member) {
            const { chat, new_chat_member, from } = payload.my_chat_member;
            console.log(`Processing my_chat_member in chat: ${chat.title || chat.id} (status: ${new_chat_member.status})`);

            // Check if the bot was added as an administrator or creator
            if (new_chat_member.status === "administrator" || new_chat_member.status === "creator") {
                const tgChatId = chat.id.toString();
                const tgUserId = from.id.toString();

                // Find the user by their Telegram ID
                const user = await prisma.user.findUnique({
                    where: { tgId: tgUserId }
                });

                if (user) {
                    console.log(`Linking channel ${tgChatId} to user ${user.tgId} (DB ID: ${user.id})`);

                    // Upsert by userId to ensure one user only has one active channel record
                    // and to prevent unique constraint failures when switching channels.
                    await prisma.channel.upsert({
                        where: { userId: user.id },
                        update: {
                            tgChatId,
                            isActive: true,
                            isVerified: true
                        },
                        create: {
                            tgChatId,
                            userId: user.id,
                            isActive: true,
                            isVerified: true
                        }
                    });

                    await sendMessage(tgUserId, `✅ Channel connected! I'll now sync music from ${chat.title || "your channel"}.`);
                } else {
                    console.warn(`User with tgId ${tgUserId} not found in database. Make sure you opened the Mini App at least once.`);
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
                console.log(`Processing audio channel_post in ${tgChatId}: ${audio.title || "No Title"} - ${audio.performer || "No Performer"}`);

                // Find the channel in our DB
                const channel = await prisma.channel.findUnique({
                    where: { tgChatId }
                });

                if (channel) {
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
                    console.log(`Song synced: ${audio.title || "Unknown Title"}`);
                } else {
                    console.log(`No registered channel found for tgChatId ${tgChatId}`);
                }
            }
            return new Response("OK");
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        // We return 200 OK to Telegram to avoid endless retries for logical errors
        return new Response("OK");
    }

    return new Response("OK");
}
