import { createContext, useCallback, useContext, useState } from "react";
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

	const [themes, setThemes] = useState<ThemeMetadata[]>([]);
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
			const { themes } = response.data;
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
			setThemeLoading(true);
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
