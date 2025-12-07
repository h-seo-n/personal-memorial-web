import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import apiClient from "../shared/api";
import styles from "../styles/End.module.css";

export const End = () => {
	const [invite, setInvite] = useState("");
	const [response, setResponse] = useState(null);
	const [index, setIndex] = useState(0);
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
				index ? (
					<>
						<div className={styles.blob} />
						<h1 className={`${styles.title} ${styles.marginTitle}`}>
							{"또 남기고 싶은 소중한 것이 있을 때\n찾아와주세요!"}{" "}
						</h1>
					</>
				) : (
					<>
						<div className={styles.blob} />
						<h1 className={`${styles.title} ${styles.marginTitle}`}>
							{
								"방금 작성한 초대장은, \n당신이 세상을 떠난 뒤에 주변인에게 발송될 거예요."
							}
						</h1>
					</>
				)
			) : (
				<>
					<div className={styles.blob} />
					<h1 className={styles.title}>
						보러올 이들에게 하고 싶은 말이 있나요?
					</h1>
					<textarea
						className={styles.textarea}
						value={invite}
						onChange={(e) => setInvite(e.target.value)}
						placeholder="내 공간을 소개하는 초대장을 작성해주세요!"
					/>
				</>
			)}
			<button
				type="button"
				className={styles.nextButton}
				onClick={
					response
						? index
							? () => {
									// final page;
									navigate("/");
								}
							: () => {
									// explain invite meaning
									setIndex(1);
								}
						: () => {
								// input page
								saveInvite(invite);
							}
				}
			>
				<FaAngleRight color="#B4B4B4" size={50} />
			</button>
		</main>
	);
};
