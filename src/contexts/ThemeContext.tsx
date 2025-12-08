import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import apiClient from "../shared/api";
import type { Theme } from "../shared/types";
import { useObjects } from "./ObjectsContext";

interface ThemeMetadata {
	id: number;
	name: string;
	characteristics: string[];
	description: string;
	backgroundMusic: {
		url: string;
		name: string;
	};
}

export interface QA {
	question: string;
	answer: string;
}

interface ThemeContextType {
	themes: ThemeMetadata[];
	themeLoading: boolean;
	analysisLoading: boolean;
	fetchThemeQuestions: () => Promise<QA[] | undefined>;
	fetchThemeList: () => Promise<ThemeMetadata[] | undefined>;
	analyzeTheme: (
		responses: QA[],
	) => Promise<{ themeMeta: ThemeMetadata; reason: string } | undefined>;
	saveTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const { handleAxiosError } = useObjects();

	const [themes, setThemes] = useState<ThemeMetadata[]>([
		{
			id: 1,
			name: "동심파",
			characteristics: ["순수함", "가족애", "따뜻함"],
			description:
				"어린 시절의 추억과 가족과의 유대감을 중시하는 따뜻하고 순수한 마음",
			backgroundMusic: {
				url: "https://life-death-museum-bucket.s3.ap-northeast-2.amazonaws.com/music/park-%E1%84%83%E1%85%A9%E1%86%BC%E1%84%89%E1%85%B5%E1%86%B7.mp3",
				name: "동심",
			},
		},
		{
			id: 2,
			name: "낭만파",
			characteristics: ["감성", "예술", "사랑"],
			description:
				"감성적이고 예술적인 표현을 통해 사랑과 낭만을 삶의 중요한 가치로 여기는 성향",
			backgroundMusic: {
				url: "https://life-death-museum-bucket.s3.ap-northeast-2.amazonaws.com/music/central-park-jazz_%E1%84%82%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A1%E1%86%AB.wav",
				name: "낭만",
			},
		},
		{
			id: 3,
			name: "도시파",
			characteristics: ["자립심", "열정", "세련됨"],
			description:
				"주체적이고 열정적인 태도로 현대적이고 세련된 감각을 추구하며 성취를 중시하는 성향",
			backgroundMusic: {
				url: "https://life-death-museum-bucket.s3.ap-northeast-2.amazonaws.com/music/central-park-jazz_%E1%84%82%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A1%E1%86%AB.wav",
				name: "도시",
			},
		},
		{
			id: 4,
			name: "자연파",
			characteristics: ["자연", "소박함", "평온함"],
			description:
				"복잡함보다는 단순함을 추구하며 자연 속에서의 평화와 여유로운 삶을 지향하는 성향",
			backgroundMusic: {
				url: "https://life-death-museum-bucket.s3.ap-northeast-2.amazonaws.com/music/central-park-jazz_%E1%84%82%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A1%E1%86%AB.wav",
				name: "자연",
			},
		},
		{
			id: 5,
			name: "기억파",
			characteristics: ["추억", "그리움", "연결"],
			description:
				"과거의 인연을 소중히 여기고 깊은 그리움과 사람 간의 연결을 강조하는 성향",
			backgroundMusic: {
				url: "https://life-death-museum-bucket.s3.ap-northeast-2.amazonaws.com/music/central-park-jazz_%E1%84%82%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A1%E1%86%AB.wav",
				name: "기억",
			},
		},
	]);
	const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
	const [themeLoading, setThemeLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchThemeQuestions = useCallback(async () => {
		setThemeLoading(true);
		try {
			const response = await apiClient.get("/onboarding/theme");
			const { questions } = response.data;
			setThemeLoading(false);
			return questions;
		} catch (error) {
			handleAxiosError(error, "fetch theme question");
			setThemeLoading(false);
		}
	}, [handleAxiosError]);

	const fetchThemeList = useCallback(async () => {
		setThemeLoading(true);
		try {
			const response = await apiClient.get("/onboarding/themes");
			const { themes } = response.data.data;
			console.log(themes);
			setThemeLoading(false);
			setThemes(themes);
			return themes;
		} catch (error) {
			handleAxiosError(error, "fetch theme list");
			setThemeLoading(false);
		}
	}, [handleAxiosError]);

	// gets analyzed theme; doesn't include save
	const analyzeTheme = useCallback(
		async (responses: QA[]) => {
			setAnalysisLoading(true);
			try {
				const response = await apiClient.post("/onboarding/theme/analyze", {
					responses,
				});
				const { theme, analysis } = response.data.data;
				const themeMeta = theme;
				const reason = analysis.reason;

				setAnalysisLoading(false);

				return { themeMeta, reason };
			} catch (error) {
				handleAxiosError(error, "analyze theme");
				setAnalysisLoading(false);
			}
		},
		[handleAxiosError],
	);

	// saves final selected theme to user -> 부르고 나서 다시 user fetch
	const saveTheme = useCallback(
		async (themeId: string) => {
			setAnalysisLoading(true);
			try {
				await apiClient.put(`/users/theme/${themeId}`);
			} catch (error) {
				handleAxiosError(error, "save theme to user");
			} finally {
				setAnalysisLoading(false);
			}
		},
		[handleAxiosError],
	);

	useEffect(() => {
		fetchThemeList();
	}, [fetchThemeList]);

	return (
		<ThemeContext.Provider
			value={{
				themes,
				analysisLoading,
				themeLoading,
				fetchThemeQuestions,
				fetchThemeList,
				analyzeTheme,
				saveTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return ctx;
};
