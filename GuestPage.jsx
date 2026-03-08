import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lookupCodeOnServer } from "../invitationLogic.js";

export function CodeEntryPage() {
	const navigate = useNavigate();

	const [invitationCode, setInvitationCode] = useState("cjbm4ahj");
	const [guestCode, setGuestCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!invitationCode.trim() || !guestCode.trim()) {
			setError("Vui lòng nhập đầy đủ mã thiệp và mã khách.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Load thiệp trực tiếp từ invitation ID
			const result = await fetch(
				`${import.meta.env?.VITE_API_BASE || ""}/api/invitations/${encodeURIComponent(invitationCode.trim())}`,
			);
			if (!result.ok) {
				if (result.status === 404) {
					setError("Mã thiệp không tồn tại. Vui lòng kiểm tra lại.");
				} else {
					setError("Không tải được thiệp. Vui lòng thử lại sau.");
				}
				setLoading(false);
				return;
			}

			const invitation = await result.json();
			const guests = Array.isArray(invitation.g) ? invitation.g : [];
			const matchedGuest = guests.find(
				(g) =>
					(g.id || "").toLowerCase() ===
					guestCode.trim().toLowerCase(),
			);

			if (!matchedGuest) {
				setError(
					"Mã khách không đúng với thiệp này. Vui lòng kiểm tra lại.",
				);
				setLoading(false);
				return;
			}

			// Thành công → chuyển sang trang thiệp cá nhân
			navigate(
				`/i/${encodeURIComponent(guestCode.trim())}?invitation=${encodeURIComponent(invitationCode.trim())}`,
			);
		} catch (e) {
			console.error(e);
			setError("Không tải được thiệp. Vui lòng thử lại sau.");
			setLoading(false);
		}
	};

	return (
		<div className="app-shell">
			<header style={{ marginBottom: 20 }}>
				<h1 className="app-header-title">Làm bài kiểm tra</h1>
				<p className="app-header-subtitle">
					Nhập <strong>số thứ tự trong danh sách lớp</strong> để làm
					bài và nhận ma trận.
				</p>
			</header>

			<div className="card">
				<h2>Thông tin bài ôn tập</h2>
				<small>
					Nhập <strong>mã bài</strong> (từ người gửi) và{" "}
					<strong>mã học sinh</strong> (số thứ tự của bạn) để làm bài.
				</small>

				<form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
					<div className="field">
						<label htmlFor="invitationInput">Mã bài</label>
						<input
							id="invitationInput"
							type="text"
							placeholder="VD: abc123, cjbm4ahj..."
							value={invitationCode}
							onChange={(e) => setInvitationCode(e.target.value)}
							disabled={loading}
							autoFocus
						/>
						<small style={{ color: "#6b7280", fontSize: "0.85em" }}>
							Mặc định là <code>cjbm4ahj</code>. Thay đổi nếu bạn
							có mã bài khác từ người gửi.
						</small>
					</div>
					<div className="field">
						<label htmlFor="guestInput">
							Mã học sinh (số thứ tự)
						</label>
						<input
							id="guestInput"
							type="text"
							placeholder="VD: 001, 002, 015..."
							value={guestCode}
							onChange={(e) => setGuestCode(e.target.value)}
							disabled={loading}
						/>
					</div>
					{error && (
						<p
							className="note"
							style={{ color: "#b91c1c", marginTop: 4 }}
						>
							{error}
						</p>
					)}
					<div className="btn-row" style={{ marginTop: 12 }}>
						<button
							className="btn"
							type="submit"
							disabled={loading}
						>
							{loading ? "Đang tải..." : "Làm bài"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
