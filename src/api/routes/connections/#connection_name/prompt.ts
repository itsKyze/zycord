/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Router, Request, Response } from "express";
import { ConnectedAccount } from "@spacebar/database";
import { ConnectionStore, emitEvent, FieldErrors, GenericConnection } from "@spacebar/util";

const router = Router({ mergeParams: true });

router.get("/", async (req: Request, res: Response) => {
    const { connection_name } = req.params as { [key: string]: string };
    let connection = ConnectionStore.connections.get(connection_name);
    if (!connection) {
        connection = new GenericConnection(connection_name);
        ConnectionStore.connections.set(connection_name, connection);
    }

    const state = String(req.query.state || "");
    const friendlyName = connection.friendlyName || connection_name;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link ${friendlyName} - Zycord</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #1e1f22;
            color: #f2f3f5;
            font-family: -apple-system, BlinkMacSystemFont, "gg sans", "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        .card {
            background-color: #2b2d31;
            border-radius: 12px;
            padding: 32px 28px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            text-align: center;
        }
        .title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
        }
        .subtitle {
            font-size: 14px;
            color: #949ba4;
            margin-bottom: 24px;
            line-height: 1.4;
        }
        .field {
            text-align: left;
            margin-bottom: 20px;
        }
        label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #b5bac1;
            margin-bottom: 8px;
        }
        input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 6px;
            border: 1px solid #1e1f22;
            background-color: #1e1f22;
            color: #ffffff;
            font-size: 15px;
            outline: none;
            transition: border 0.15s ease;
        }
        input:focus {
            border-color: #5865f2;
        }
        button {
            width: 100%;
            padding: 13px;
            border-radius: 6px;
            border: none;
            background-color: #5865f2;
            color: #ffffff;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease;
        }
        button:hover {
            background-color: #4752c4;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1 class="title">Connect ${friendlyName}</h1>
        <p class="subtitle">Enter your account name or handle to link it directly to your Zycord profile.</p>
        <form method="POST" action="/connections/${connection_name}/prompt">
            <input type="hidden" name="state" value="${state.replace(/"/g, "&quot;")}" />
            <div class="field">
                <label for="username">Username or ID</label>
                <input type="text" id="username" name="username" placeholder="e.g. MyAccount" required autofocus />
            </div>
            <button type="submit">Link Account</button>
        </form>
    </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
});

router.post("/", async (req: Request, res: Response) => {
    const { connection_name } = req.params as { [key: string]: string };
    let connection = ConnectionStore.connections.get(connection_name);
    if (!connection) {
        connection = new GenericConnection(connection_name);
        ConnectionStore.connections.set(connection_name, connection);
    }

    const state = String(req.body.state || req.query.state || "");
    const username = String(req.body.username || req.body.name || "").trim();

    if (!username) {
        return res.status(400).send("Username is required.");
    }

    let userId: string;
    try {
        userId = connection.getUserId(state);
        connection.validateState(state);
    } catch (_) {
        return res.status(400).send("Invalid or expired connection state. Please try again from settings.");
    }

    let account = await ConnectedAccount.findOne({
        where: { user_id: userId, type: connection_name, external_id: username },
    });

    if (!account) {
        account = await connection.createConnection({
            user_id: userId,
            external_id: username,
            name: username,
            type: connection_name,
            verified: true,
            visibility: 1,
            friend_sync: false,
        });
    }

    await emitEvent({
        event: "USER_CONNECTIONS_UPDATE",
        data: { ...account, token_data: undefined },
        user_id: userId,
    });

    const successHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Connected - Zycord</title>
    <style>
        body {
            background-color: #1e1f22;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "gg sans", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .box {
            background-color: #2b2d31;
            padding: 36px 32px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            max-width: 400px;
        }
        h2 { color: #57f287; margin-bottom: 8px; }
        p { color: #949ba4; font-size: 14px; }
        .btn {
            display: inline-block;
            margin-top: 18px;
            padding: 10px 20px;
            background: #5865f2;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
        }
        .btn:hover { background: #4752c4; }
    </style>
</head>
<body>
    <div class="box">
        <h2>Connected!</h2>
        <p>Your ${connection.friendlyName} account has been linked to Zycord.</p>
        <p style="margin-top: 6px;">This window will close automatically...</p>
        <a class="btn" href="/app">Return to Zycord</a>
    </div>
    <script>
        try {
            if (window.opener) {
                window.opener.postMessage("DISCORD_OAUTH_SUCCESS", "*");
                window.opener.postMessage({ type: "CONNECTION_AUTHORIZED", provider: "${connection_name}" }, "*");
            }
        } catch (_) {}
        setTimeout(() => {
            window.close();
        }, 800);
    </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(successHtml);
});

export default router;
