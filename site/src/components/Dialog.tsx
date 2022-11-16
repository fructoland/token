

interface Props {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Dialog({ open, onClose, children } : Props) {
	return (
		<div
			className={`dialog ${open ? "open" : ""}`}
			onClick={onClose}
		>
			<div
				className="content"
				onClick={e => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	)
}
