// --- Kiểu dữ liệu & hàm tiện ích dùng chung cho Host/Guest ---

export function parseGuestList(rawText) {
	const lines = (rawText || "")
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.length > 0);

	const guests = [];
	for (const line of lines) {
		let id = "";
		let name = "";

		if (line.includes("-")) {
			const [left, ...rest] = line.split("-");
			id = left.trim();
			name = rest.join("-").trim();
		} else if (line.includes("|")) {
			const [left, ...rest] = line.split("|");
			id = left.trim();
			name = rest.join("|").trim();
		} else {
			const parts = line.split(" ");
			id = parts[0];
			name = parts.slice(1).join(" ").trim();
		}

		if (!id || !name) continue;

		guests.push({
			id,
			name,
			idLower: id.toLowerCase(),
			nameLower: name.toLowerCase(),
		});
	}

	return guests;
}

export function findGuestByInput(rawInput, parsedGuests) {
	const value = (rawInput || "").trim().toLowerCase();
	if (!value) return null;
	if (!Array.isArray(parsedGuests) || parsedGuests.length === 0) return null;

	return parsedGuests.find((g) => g.idLower === value) || null;
}

// --- Giao tiếp với server để lưu / đọc thiệp dưới file JSON ---

// Mặc định dùng API cùng origin qua path /api.
// Khi cần tách domain, cấu hình VITE_API_BASE (vd: https://api.example.com).
const API_BASE =
	typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE
		? import.meta.env.VITE_API_BASE
		: "";

export async function createInvitationOnServer(config) {
	const res = await fetch(`${API_BASE}/api/invitations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(config),
	});

	if (!res.ok) {
		throw new Error("Không lưu được thiệp lên server");
	}

	return res.json(); // { id, ... }
}

export async function loadInvitationFromServer(invitationId) {
	const res = await fetch(`${API_BASE}/api/invitations/${invitationId}`);
	if (res.status === 404) {
		return null;
	}
	if (!res.ok) {
		throw new Error("Không tải được thiệp từ server");
	}
	return res.json();
}

// Tra cứu mã mời → trả về mảng [{ invitationId, guestId, guestName }]
export async function lookupCodeOnServer(code) {
	const res = await fetch(
		`${API_BASE}/api/invitations/by-code/${encodeURIComponent(code)}`,
	);
	if (res.status === 404) {
		return [];
	}
	if (!res.ok) {
		throw new Error("Không tra cứu được mã mời");
	}
	return res.json();
}
