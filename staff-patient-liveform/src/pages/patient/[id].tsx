import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "../../lib/socket";

export default function PatientForm() {
	const router = useRouter();
	const { id: patientId } = router.query;
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [formData, setFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		dob: "",
		gender: "",
		phone: "",
		email: "",
		address: "",
		language: "",
		nationality: "",
		emergencyContact: "",
		religion: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedMessage, setSubmittedMessage] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const emitEdit = () => {
		if (typeof patientId !== "string") return;
		const lastStatus = sessionStorage.getItem(`status-${patientId}`);
		if (lastStatus !== "submitted") {
			socket.emit("editing-started", patientId);
		}

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			if (typeof patientId === "string") {
				const lastStatus = sessionStorage.getItem(`status-${patientId}`);
				if (lastStatus !== "submitted") {
					socket.emit("editing-stopped", patientId);
				}
			}
		}, 2000);
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		emitEdit();
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const requiredFields = ["firstName", "lastName", "dob", "gender", "phone", "email", "address", "language", "nationality"];
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegex = /^[0-9]{9,15}$/;
		const missingField = requiredFields.find((field) => !formData[field as keyof typeof formData]);
		if (missingField) {
			alert(`❌ ${missingField} is required.`);
			return;
		}

		if (!emailRegex.test(formData.email)) {
			alert("❌ Invalid email format.");
			return;
		}

		if (!phoneRegex.test(formData.phone)) {
			alert("❌ Invalid phone number (expecting 9-15 digits).");
			return;
		}
		if (typeof patientId === "string") {
			setIsSubmitting(true);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
			sessionStorage.setItem(`status-${patientId}`, "submitted");
			socket.emit("form-submitted", patientId);
			socket.off("editing-started");
			socket.off("editing-stopped");
			setSubmittedMessage("✅ Form submitted successfully! Redirecting...");
			setTimeout(() => {
				router.push("/");
			}, 2000);
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
			<h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Patient Form</h1>
			<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
				{submittedMessage && (
					<div style={{ backgroundColor: "#e0ffe0", padding: "0.75rem", borderRadius: "4px", color: "green", fontWeight: "bold", textAlign: "center" }}>
						{submittedMessage}
					</div>
				)}
				<input name="firstName" placeholder="First Name" onChange={handleChange} required style={inputStyle} />
				<input name="middleName" placeholder="Middle Name (optional)" onChange={handleChange} style={inputStyle} />
				<input name="lastName" placeholder="Last Name" onChange={handleChange} required style={inputStyle} />
				<input name="dob" placeholder="Date of Birth" type="date" onChange={handleChange} required style={inputStyle} />
				<select name="gender" onChange={handleChange} required style={inputStyle}>
					<option value="">Select Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<input name="phone" placeholder="Phone Number" onChange={handleChange} required style={inputStyle} />
				<input name="email" placeholder="Email" type="email" onChange={handleChange} required style={inputStyle} />
				<input name="address" placeholder="Address" onChange={handleChange} required style={inputStyle} />
				<input name="language" placeholder="Preferred Language" onChange={handleChange} required style={inputStyle} />
				<input name="nationality" placeholder="Nationality" onChange={handleChange} required style={inputStyle} />
				<input name="emergencyContact" placeholder="Emergency Contact (Name and Relationship)" onChange={handleChange} style={inputStyle} />
				<input name="religion" placeholder="Religion (optional)" onChange={handleChange} style={inputStyle} />
				<button
					type="submit"
					disabled={isSubmitting}
					style={{
						padding: "0.75rem",
						backgroundColor: isSubmitting ? "#aaa" : "#0070f3",
						color: "#fff",
						border: "none",
						borderRadius: "4px",
						fontWeight: "bold",
						cursor: isSubmitting ? "not-allowed" : "pointer",
					}}>
					{isSubmitting ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}

const inputStyle = {
	padding: "0.75rem",
	border: "1px solid #ccc",
	borderRadius: "4px",
	fontSize: "1rem",
};
