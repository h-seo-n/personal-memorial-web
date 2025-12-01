import { createContext, useCallback, useContext, useState } from "react";
import apiClient from "../shared/api";
import type { Theme } from "../shared/types";
import { useObjects } from "./ObjectsContext";

interface ThemeMetadata {
	id: number;
	name: string;
	characteristics: string[];
	description: string;
}

export interface QA {
	question: string;
	answer: string;
}

interface ThemeContextType {
	themeLoading: boolean;
	fetchThemeQuestions: () => Promise<QA[] | undefined>;
	fetchThemeList: () => Promise<ThemeMetadata[] | undefined>;
	analyzeTheme: (
		responses: QA[],
	) => Promise<{ themeMeta: ThemeMetadata; reason: string } | undefined>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const { handleAxiosError } = useObjects();

	const [theme, setTheme] = useState<Theme | null>(null);

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
			return themes;
		} catch (error) {
			handleAxiosError(error, "fetch theme list");
			setThemeLoading(false);
		}
	}, [handleAxiosError]);

	const analyzeTheme = useCallback(
		async (responses: QA[]) => {
			setThemeLoading(true);
			try {
				const response = await apiClient.post("/onboarding/theme/analyze", {
					responses,
				});
				const { theme, analysis } = response.data.data;
				const themeMeta = theme;
				const reason = analysis.reason;

				setThemeLoading(false);

				return { themeMeta, reason };
			} catch (error) {
				handleAxiosError(error, "analyze theme");
				setThemeLoading(false);
			}
		},
		[handleAxiosError],
	);

	return (
		<ThemeContext.Provider
			value={{
				themeLoading,
				fetchThemeQuestions,
				fetchThemeList,
				analyzeTheme,
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
