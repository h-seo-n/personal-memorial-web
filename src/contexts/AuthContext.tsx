import {
	type ReactNode,
	createContext,
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
	questionIndex: number;
}
