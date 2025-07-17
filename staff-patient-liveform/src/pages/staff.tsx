import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

interface PatientStatus {
	[patientId: string]: string;
}

export default function StaffDashboard() {
	const [statuses, setStatuses] = useState<PatientStatus>({});

	useEffect(() => {
		const listener = ({ patientId, status }: { patientId: string; status: string }) => {
			console.log(`Received ${status} for ${patientId}`);
			setStatuses((prev) => ({ ...prev, [patientId]: status }));
		};

		socket.on("patient-editing", listener);
		return () => {
			socket.off("patient-editing", listener);
		};
	}, []);

	const getColor = (status: string) => {
		switch (status) {
			case "editing":
				return "green";
			case "submitted":
				return "blue";
			default:
				return "gray";
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
			<h1>Staff View: Real-time Patient Status</h1>
			{Object.entries(statuses).map(([id, status]) => (
				<p key={id}>
					Patient {id}: <strong style={{ color: getColor(status) }}>{status}</strong>
				</p>
			))}
		</div>
	);
}
