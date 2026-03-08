import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { HostPage } from "./components/HostPage.jsx";
import { GuestPage } from "./components/GuestPage.jsx";
import { CodeEntryPage } from "./components/CodeEntryPage.jsx";

function NotFoundPage() {
	return (
		<div className="app-shell">
			<div className="card" style={{ textAlign: "center" }}>
				<h2>404 - Không tìm thấy trang</h2>
				<p className="note">
					Đường dẫn không hợp lệ. Vui lòng quay lại trang nhập mã.
				</p>
				<div
					className="btn-row"
					style={{ justifyContent: "center", marginTop: 12 }}
				>
					<Link to="/" className="btn-ghost">
						Về trang nhập mã
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const location = useLocation();
	const isGuestPage = location.pathname.startsWith("/i/");
	const isCodeEntryPage = location.pathname === "/";

	return (
		<>
			{!isGuestPage && !isCodeEntryPage && (
				<div className="app-shell" style={{ paddingBottom: 8 }}>
					<div className="layout-header-actions">
						<span className="note">
							Sau khi Generate link, Host gửi link trang nhập mã
							chung <span className="inline-code">/</span> cho mọi
							Guest. Khách nhập số thứ tự để xem thiệp cá nhân của
							mình.
						</span>
					</div>
				</div>
			)}
			<Routes>
				<Route path="/" element={<CodeEntryPage />} />
				<Route path="/create" element={<HostPage />} />
				<Route path="/i/:guestId" element={<GuestPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}
