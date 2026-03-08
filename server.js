const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_DIR = path.join(__dirname, "dist");

const DATA_DIR =
	process.env.DATA_DIR || path.join(__dirname, "data", "invitations");
fs.mkdirSync(DATA_DIR, { recursive: true });

// CORS: Cho phép mọi origin trong development (bao gồm localhost và IP local network)
app.use(
	cors({
		origin: true, // Cho phép mọi origin
		credentials: true,
	}),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
	res.json({
		ok: true,
		service: "invitation-generator",
		dataDir: DATA_DIR,
	});
});

// Tạo thiệp mới và lưu xuống file JSON local
app.post("/api/invitations", (req, res) => {
	try {
		const body = req.body || {};
		const id = body.id || Math.random().toString(36).slice(2, 10);

		const config = {
			id,
			t: body.t || "classic",
			e: body.e || {},
			g: Array.isArray(body.g) ? body.g : [],
		};

		console.log(id);

		const filePath = path.join(DATA_DIR, `${id}.json`);
		fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");

		res.status(201).json({ id });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Không lưu được thiệp" });
	}
});

// Đọc thiệp từ file JSON theo invitationId
app.get("/api/invitations/:id", (req, res) => {
	const id = req.params.id;
	const filePath = path.join(DATA_DIR, `${id}.json`);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: "Không tìm thấy thiệp" });
	}

	try {
		const content = fs.readFileSync(filePath, "utf-8");
		res.setHeader("Content-Type", "application/json");
		res.send(content);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Không đọc được thiệp" });
	}
});

// Tra cứu mã mời trong tất cả các thiệp → trả về mảng các {invitationId, guestId}
app.get("/api/invitations/by-code/:code", (req, res) => {
	const code = (req.params.code || "").trim().toLowerCase();
	if (!code) {
		return res.status(400).json({ error: "Mã không hợp lệ" });
	}

	try {
		const files = fs.readdirSync(DATA_DIR);
		const results = [];
		for (const file of files) {
			if (!file.endsWith(".json")) continue;
			const filePath = path.join(DATA_DIR, file);
			const content = fs.readFileSync(filePath, "utf-8");
			const config = JSON.parse(content);

			const guests = Array.isArray(config.g) ? config.g : [];
			const matchedGuests = guests.filter(
				(g) => (g.id || "").toLowerCase() === code,
			);

			if (matchedGuests.length > 0) {
				const invitationId = config.id || file.replace(".json", "");
				matchedGuests.forEach((guest) => {
					results.push({
						invitationId,
						guestId: guest.id,
						guestName: guest.name,
					});
				});
			}
		}

		if (results.length === 0) {
			return res.status(404).json({ error: "Không tìm thấy mã mời" });
		}

		res.json(results);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Lỗi tra cứu mã" });
	}
});

// Production: phục vụ frontend build từ dist
if (fs.existsSync(DIST_DIR)) {
	app.use(express.static(DIST_DIR));

	// SPA fallback cho mọi route không phải /api
	app.get(/^\/(?!api).*/, (req, res) => {
		res.sendFile(path.join(DIST_DIR, "index.html"));
	});
}

// Bind vào 0.0.0.0 để có thể truy cập từ mạng local (điện thoại, máy khác)
app.listen(PORT, "0.0.0.0", () => {
	const os = require("os");
	const networkInterfaces = os.networkInterfaces();
	let localIp = "localhost";

	// Tìm IP local network
	for (const name of Object.keys(networkInterfaces)) {
		for (const iface of networkInterfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				localIp = iface.address;
				break;
			}
		}
		if (localIp !== "localhost") break;
	}

	console.log(`Invitation API server chạy tại:`);
	console.log(`  - http://localhost:${PORT}`);
	console.log(`  - http://${localIp}:${PORT}`);
});
