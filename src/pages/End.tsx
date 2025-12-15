import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../shared/api";
import styles from "../styles/End.module.css";

export const End = () => {
	const [invite, setInvite] = useState("");
	const [response, setResponse] = useState(null);
	const [index, setIndex] = useState(0);
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const saveInvite = async (invite: string | null) => {
		const response = await apiClient.patch("/users/invitation", {
			invitation: invite,
		});
		setResponse(response);
	};

	const location = useLocation();
	const qrUrl = location.state?.qrUrl;

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
							제작한 추모관을 간직해보세요!
						</h1>
						<div className={styles.imgWrapper}>
							<img src={qrUrl} alt="추모관 사진이 담긴 qr 링크" />
							<h3>{user.name} 님의 추모관</h3>
						</div>
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
									logout();
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
				disabled={!invite.trim()}
			>
				<FaAngleRight color="#B4B4B4" size={50} />
			</button>
		</main>
	);
};
