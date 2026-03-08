import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
	loadInvitationFromServer,
	lookupCodeOnServer,
} from "../invitationLogic.js";
import { InvitationPreview } from "./InvitationPreview.jsx";
import { TEMPLATES } from "../templates.js";

export function GuestPage() {
	const { guestId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const invitationId = searchParams.get("invitation");
	const [lookupResults, setLookupResults] = useState([]);
	const [selectedInvitation, setSelectedInvitation] = useState(null);
	const [config, setConfig] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;
		async function fetchConfig() {
			try {
				setError("");

				let data;
				if (invitationId) {
					// Load trực tiếp từ invitation ID
					data = await loadInvitationFromServer(invitationId);
					if (!cancelled) {
						if (!data) {
							setError(
								"Không tìm thấy thiệp tương ứng. Có thể thiệp đã bị xoá hoặc chưa được lưu.",
							);
							return;
						}
						setConfig(data);
					}
				} else {
					// Fallback: tra cứu mã khách để lấy invitationId (cho compatibility)
					const results = await lookupCodeOnServer(guestId);
					if (!cancelled) {
						if (results.length === 0) {
							setError(
								"Mã mời không hợp lệ. Vui lòng kiểm tra lại hoặc liên hệ người gửi thiệp.",
							);
							return;
						}
						if (results.length === 1) {
							data = await loadInvitationFromServer(
								results[0].invitationId,
							);
							if (!cancelled) {
								if (!data) {
									setError(
										"Không tìm thấy thiệp tương ứng. Có thể thiệp đã bị xoá hoặc chưa được lưu.",
									);
								} else {
									setConfig(data);
								}
							}
						} else {
							// Nhiều kết quả - hiển thị lựa chọn
							setLookupResults(results);
						}
					}
				}
			} catch (e) {
				if (!cancelled) {
					console.error(e);
					setError(
						"Không tải được thiệp từ server. Vui lòng thử lại sau.",
					);
				}
			}
		}
		fetchConfig();
		return () => {
			cancelled = true;
		};
	}, [guestId, invitationId]);

	const templateId = config?.t && TEMPLATES[config.t] ? config.t : "classic";
	const event = config?.e || {
		eventTitle: "Thiệp mời sự kiện",
		hostMessage:
			"Gia đình chúng tôi trân trọng kính mời bạn đến tham dự buổi tiệc nhỏ cùng chúng tôi.",
		dateTime: "",
		location: "",
		note: "",
	};

	const [pageIndex, setPageIndex] = useState(0);

	const matchedGuest = useMemo(() => {
		const list = Array.isArray(config?.g) ? config.g : [];
		const code = (guestId || "").trim().toLowerCase();
		if (!code) return null;
		return list.find((g) => (g.id || "").toLowerCase() === code) || null;
	}, [guestId, config]);

	const guestForPreview = useMemo(() => {
		if (matchedGuest) {
			return {
				display: `${matchedGuest.name} (${matchedGuest.id})`,
				imageUrl: matchedGuest.imageUrl || "",
				wishes: matchedGuest.wishes || "",
			};
		}
		return { display: "" };
	}, [matchedGuest]);

	const template = TEMPLATES[templateId] || TEMPLATES.classic;

	const goPrevPage = () => {
		setPageIndex((prev) => Math.max(prev - 1, 0));
	};

	const goNextPage = () => {
		setPageIndex((prev) => Math.min(prev + 1, template.pageCount - 1));
	};

	return (
		<div className="invitation-page">
			{error && <div className="error-message">{error}</div>}

			{lookupResults.length > 1 && !selectedInvitation && (
				<div className="invitation-selection">
					<h2>Chọn thiệp mời của bạn</h2>
					<p>
						Mã mời "{guestId}" có trong nhiều thiệp. Vui lòng chọn
						thiệp bạn muốn xem:
					</p>
					<ul className="invitation-list">
						{lookupResults.map((result, index) => (
							<li key={index}>
								<button
									type="button"
									className="btn-primary"
									onClick={() =>
										navigate(
											`/i/${encodeURIComponent(guestId)}?invitation=${encodeURIComponent(result.invitationId)}`,
										)
									}
								>
									Thiệp từ {result.guestName} (ID:{" "}
									{result.invitationId})
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{selectedInvitation && !config && !error && (
				<div className="loading">Đang tải thiệp...</div>
			)}

			{config && matchedGuest && (
				<div className="invitation-wrapper">
					<InvitationPreview
						templateId={templateId}
						pageIndex={pageIndex}
						eventData={event}
						guest={guestForPreview}
						showFooter={false}
					/>
					{template.pageCount > 1 && (
						<div
							className="btn-row"
							style={{
								justifyContent: "space-between",
								marginTop: 12,
							}}
						>
							<div>
								<button
									type="button"
									className="btn-ghost"
									onClick={goPrevPage}
									disabled={pageIndex === 0}
								>
									◀ Trang trước
								</button>
								<button
									type="button"
									className="btn-ghost"
									onClick={goNextPage}
									disabled={
										pageIndex === template.pageCount - 1
									}
									style={{ marginLeft: 8 }}
								>
									Trang sau ▶
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{!config && !error && (
				<p className="note" style={{ textAlign: "center" }}>
					Đang tải dữ liệu thiệp...
				</p>
			)}
			{error && (
				<p
					className="note"
					style={{ color: "#b91c1c", textAlign: "center" }}
				>
					{error}
				</p>
			)}
			{config && !matchedGuest && !error && (
				<p
					className="note"
					style={{ color: "#b91c1c", textAlign: "center" }}
				>
					Mã mời trong link không hợp lệ. Vui lòng kiểm tra lại hoặc
					liên hệ người gửi thiệp.
				</p>
			)}
		</div>
	);
}
