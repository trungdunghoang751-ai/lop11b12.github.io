import React from "react";
import { TEMPLATES } from "../templates.js";

export function InvitationPreview({
	templateId,
	pageIndex,
	eventData,
	guest,
	showFooter = true,
}) {
	const template = TEMPLATES[templateId] || TEMPLATES.classic;
	const clampedIndex = Math.min(
		Math.max(pageIndex, 0),
		template.pageCount - 1,
	);

	const page = template.renderPage(clampedIndex, { event: eventData, guest });

	return (
		<div className="preview">
			<div
				className="card-preview"
				style={{
					background: page.background,
				}}
			>
				<div className="card-preview-inner">
					{page.heroImageUrl && (
						<div className="invite-image">
							<img
								src={page.heroImageUrl}
								alt="Invitation background"
							/>
						</div>
					)}
					<div className="card-text">
						<div className="tagline">{page.tagline}</div>
						<div className="event-title">{page.title}</div>
						{page.avatarImageUrl && (
							<div className="invite-avatar">
								<img src={page.avatarImageUrl} alt="Guest" />
							</div>
						)}
						{page.invitee && (
							<div className="invitee-name">{page.invitee}</div>
						)}
						{page.hostMessage && (
							<div className="event-line">{page.hostMessage}</div>
						)}
						{page.wishes && (
							<div
								className="event-line"
								style={{ fontStyle: "italic", color: "#666" }}
							>
								{page.wishes}
							</div>
						)}
						{page.datetime && (
							<div className="event-line">{page.datetime}</div>
						)}
						{page.location && (
							<div className="event-line">{page.location}</div>
						)}
						{page.note && (
							<div className="event-note">{page.note}</div>
						)}
					</div>
				</div>
			</div>
			{showFooter && (
				<div className="preview-footer">
					<div>
						<div className="page-nav">
							<span className="page-indicator">
								Trang {clampedIndex + 1}/{template.pageCount}
							</span>
						</div>
						<div className="note">
							Chọn template & dùng điều hướng để xem các trang
							thiệp khác nhau.
						</div>
					</div>
					<span className="pill">
						<span className="pill-dot" />
						<span>Guest preview</span>
					</span>
				</div>
			)}
		</div>
	);
}
