import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import apiClient from "../shared/api";
import styles from "../styles/End.module.css";

export const End = () => {
	const [invite, setInvite] = useState("");
	const [response, setResponse] = useState(null);
	const navigate = useNavigate();
	const saveInvite = async (invite: string | null) => {
		const response = await apiClient.patch("/users/invitation", {
			invitation: invite,
		});
		setResponse(response);
	};

	return (
		<main className={styles.mainWrapper}>
			{response ? (
				<>
					<div className={styles.blob} />
					<h1 className={styles.title}>
						또 남기고 싶은 소중한 것이 있을 때 찾아와주세요!
					</h1>
				</>
			) : (
				<>
					<div className={styles.blob} />
					<h1 className={styles.title}>
						보러올 이들에게 하고 싶은 말이 있나요?
					</h1>
					<textarea placeholder="내 공간을 소개하는 초대장을 작성해주세요!" />
				</>
			)}
			<button
				type="button"
				className={styles.nextButton}
				onClick={
					response
						? () => {
								navigate("/");
							}
						: () => {
								saveInvite(invite);
							}
				}
			>
				<FaAngleRight color="#B4B4B4" size={50} />
			</button>
		</main>
	);
};
