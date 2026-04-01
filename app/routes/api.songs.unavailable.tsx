import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../../prisma/prisma";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const formData = await request.formData();
    const fileId = formData.get("fileId") as string;

    if (!fileId) {
        return new Response("Missing fileId", { status: 400 });
    }

    try {
        await prisma.song.update({
            where: { fileId },
            data: { isAvailable: false }
        });
        console.log(`Song marked as unavailable: ${fileId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to mark song as unavailable", error);
        return new Response("Database Error", { status: 500 });
    }
}
