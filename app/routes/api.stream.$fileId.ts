import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { fileId } = params;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!fileId || !token) {
        return new Response("Missing parameters", { status: 400 });
    }

    try {
        // 1. Get file path from Telegram
        const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
        const fileInfoResponse = await fetch(getFileUrl);
        const fileInfo = await fileInfoResponse.json();

        if (!fileInfo.ok || !fileInfo.result.file_path) {
            return new Response("File not found on Telegram", { status: 404 });
        }

        const filePath = fileInfo.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

        // 2. Proxy the file stream with Range support
        const range = request.headers.get("Range");
        const fetchOptions: RequestInit = {
            method: "GET",
        };
        if (range) {
            fetchOptions.headers = { Range: range };
        }

        const response = await fetch(downloadUrl, fetchOptions);

        // Copy headers to handle range requests, content-type, etc.
        const headers = new Headers();
        const contentType = response.headers.get("Content-Type") || "audio/mpeg";
        headers.set("Content-Type", contentType);
        headers.set("Accept-Ranges", "bytes");

        const contentLength = response.headers.get("Content-Length");
        if (contentLength) headers.set("Content-Length", contentLength);

        const contentRange = response.headers.get("Content-Range");
        if (contentRange) headers.set("Content-Range", contentRange);

        return new Response(response.body, {
            status: response.status,
            headers,
        });
    } catch (error) {
        console.error("Streaming error:", error);
        return new Response("Streaming failed", { status: 500 });
    }
}
