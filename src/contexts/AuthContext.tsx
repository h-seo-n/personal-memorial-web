import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import apiClient from "../shared/api";
import type { Theme } from "../shared/types";

interface User {
	id: string;
	name: string;
	email: string;
	theme: Theme;
	invitation?: string;
	objectIds: string[];
	modifiedObjectIds: string[];
	createdAt: string;
	questionIndex: number;
}
interface LoginData {
	email: string;
	password: string;
}
interface SignupData {
	email: string;
	password: string;
	name: string;
}

interface VerifyResponse {
	valid: boolean;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

interface AuthContextType {
	user: User | null; // get theme
	isLoading: boolean;
	signUp: (data: SignupData) => Promise<void>;
	login: (data: LoginData) => Promise<void>;
	logout: () => void;
	fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = useCallback(async () => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			setUser(null);
			return;
		}

		try {
			const response = await apiClient.get<User>("/auth/profile");
			setUser(response.data);
		} catch (error) {
			console.error(error);
			localStorage.removeItem("authToken");
			setUser(null);
		}
	}, []);

	// 앱 렌더 시 저장된 토큰 있는지 확인, 있으면 user 불러옴
	useEffect(() => {
		const checkLoggedIn = async () => {
			// 저장된 인증 토큰 있는지 확인 (있으면 로그인 유지)
			const token = localStorage.getItem("authToken");

			if (token) {
				try {
					const response = await apiClient.get<VerifyResponse>("/auth/verify");

					if (response.data.valid) {
						await fetchUser();
					} else {
						localStorage.removeItem("authToken");
						setUser(null);
					}
				} catch (error) {
					localStorage.removeItem("authToken");
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setIsLoading(false);
		};
		void checkLoggedIn();
	}, [fetchUser]);

	/* 회원가입 함수 */
	const signUp = async (data: SignupData) => {
		// apiClient로 api call 보내기
		const response = await apiClient.post("/auth/signup", {
			email: data.email,
			password: data.password,
			name: data.name,
		});
		const { token } = response.data;
		localStorage.setItem("authToken", token);

		await fetchUser();
	};

	const login = async (data: LoginData) => {
		const response = await apiClient.post("/auth/login", {
			email: data.email,
			password: data.password,
		});
		// 로그인 상태
		const { token } = response.data;
		localStorage.setItem("authToken", token);

		// 유저 정보
		await fetchUser();
	};

	/* 로그아웃 함수 */
	const logout = () => {
		// 클라이언트 토큰 값만 삭제
		localStorage.removeItem("authToken");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, isLoading, signUp, login, logout, fetchUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// custom hook
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
