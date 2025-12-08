import { useEffect, useRef, useState } from "react";
import { FaMusic, FaPause, FaPlay } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../styles/BgmController.module.css";

export const BgmController = () => {
	const { themes } = useTheme();
	const { user, updateBgm } = useAuth();

	const [bgm, setBgm] = useState<{ url: string; name: string } | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const [currentTrackId, setCurrentTrackId] = useState<number>(1);
	const [volume, setVolume] = useState(0.5);

	const currentTheme = themes?.find((t) => t.id === currentTrackId);

	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	// bgm 초기값 - user 정보에서 가져옴
	useEffect(() => {
		if (!user?.theme) return;

		const match = themes?.find(
			(t) => t.backgroundMusic.name === user.theme.backgroundMusic.name,
		);
		if (match) {
			setBgm(match.backgroundMusic);
			setCurrentTrackId(match.id);
		}
	}, [user, themes]);

	// initialize audio instance
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!currentTheme) return;
		if (!audioRef.current) {
			audioRef.current = new Audio(currentTheme.backgroundMusic.url);
			audioRef.current.loop = true;
		}

		return () => {
			// 언마운트 시 정리
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	// when track changes -> change src
	useEffect(() => {
		if (!audioRef.current) return;
		if (!currentTheme) return;

		audioRef.current.src = currentTheme.backgroundMusic.url;
		audioRef.current.load();

		if (isPlaying && audioRef.current) {
			audioRef.current
				.play()
				.catch((err) =>
					console.warn("Play failed: user interaction yet to come", err),
				);
		}
	}, [currentTheme, isPlaying]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	// helper func
	const togglePlay = async () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			const playPromise = audioRef.current.play();

			if (playPromise !== undefined) {
				playPromise
					.then(() => {
						setIsPlaying(true);
					})
					.catch((error) => {
						console.error("Cannot play audio:", error);
						setIsPlaying(false);
					});
			}
		}
	};
	const [showControls, setShowControls] = useState<boolean>(true);
	const toggleControls = () => {
		setShowControls((prev) => !prev);
	};
	const getSliderBackground = () => {
		const percentage = volume * 100;
		return `linear-gradient(to right, #a881d8 0%, #a881d8 ${percentage}%, #999 ${percentage}%, #999 100%)`;
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(Number.parseFloat(e.target.value));
		console.log(themes);
	};

	return (
		<div className={styles.bgmContainer}>
			<button
				type="button"
				onClick={toggleControls}
				className={styles.toggleBtn}
			>
				<FaMusic />
			</button>

			{/* 볼륨 슬라이더 */}
			{showControls && (
				<div
					className={styles.controlPanel}
					style={showControls ? {} : { visibility: "hidden" }}
				>
					<div className={styles.buttonRow}>
						<button
							type="button"
							onClick={togglePlay}
							className={styles.playButton}
						>
							{isPlaying ? <FaPause /> : <FaPlay />}
						</button>
					</div>
					<input
						className={styles.bgmSlider}
						type="range"
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={handleVolumeChange}
						style={{ background: getSliderBackground() }}
					/>

					<div className={styles.bgmTags}>
						{themes.map((theme) => (
							<button
								key={theme.id}
								type="button"
								onClick={async () => {
									setCurrentTrackId(theme.id);
									await updateBgm(theme.id);
								}}
								className={
									theme.id === currentTrackId
										? `${styles.bgmTag} ${styles.active}`
										: `${styles.bgmTag}`
								}
							>
								{theme.backgroundMusic.name}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
