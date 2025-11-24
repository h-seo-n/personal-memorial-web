import { isAxiosError } from "axios";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import apiClient from "../shared/api";
import type {
	BaseObject,
	ItemFunction,
	SceneObject,
	imageSet,
} from "../shared/types";

interface ObjectContextType {
	inventoryObjects: BaseObject[];
	generatedObjects: SceneObject[];
	sceneObjects: SceneObject[];
	isLoading: boolean;
	error: string | null;

	updateItem: (id: string, object: SceneObject) => Promise<void>;
	addItem: (object: SceneObject) => Promise<SceneObject>;
}

interface ApiBaseObject {
	_id: string;
	name: string;
	imageSrc: string;
	description?: string;
	imageSets: imageSet[];
	isUserMade: boolean;
	onType: "LeftWall" | "RightWall" | "Floor";
}
interface ApiSceneObject {
	_id: string;
	name: string;
	imageSrc: string;
	description?: string;
	imageSets: imageSet[];
	isUserMade: boolean;
	onType: "LeftWall" | "RightWall" | "Floor";
	itemFunction: ItemFunction;
	additionalData?: string;
	coordinates: [number, number];
	isReversed: boolean;
}

const ObjectsContext = createContext<ObjectContextType | undefined>(undefined);

export const ObjectsProvider = ({ children }: { children: ReactNode }) => {
	const [inventoryObjects, setInventoryObjects] = useState<BaseObject[] | null>(
		null,
	);
	const [generatedObjects, setGeneratedObjects] = useState<
		SceneObject[] | null
	>(null);
	const [sceneObjects, setSceneObjects] = useState<SceneObject[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 앱 렌더 시 서버에서 받아올 아이템들 업데이트
	useEffect(() => {
		fetchInventory();
		fetchGenerated();
		fetchModified();
	});

	const fetchInventory = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/object/basic");
			const inventory: BaseObject[] = response.data.map((p: ApiBaseObject) => ({
				id: p._id,
				name: p.name,
				imgSrc: p.imageSrc, // default img
				description: p.description ? p.description : null,
				imageSets: p.imageSets,
				isUserMade: p.isUserMade,
				ontype: p.onType,
			}));
			setInventoryObjects(inventory);
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					`API Error in getting base objects: ${error.response.status} - ${error.response.data}`,
				);
			} else {
				setError(`Unknown error in getting base objects: ${error}`);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchGenerated = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/object");
			const generated: SceneObject[] = response.data.map(
				(p: ApiSceneObject) => ({
					base: {
						id: p._id,
						name: p.name,
						imgSrc: p.imageSrc,
						description: null,
						imageSets: p.imageSets,
						isUserMade: p.isUserMade,
						ontype: p.onType,
					},
					coordinates: p.coordinates,
					description: p.description,
					isReversed: p.isReversed,
				}),
			);
			setGeneratedObjects(generated);
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					`API Error in getting generated objects: ${error.response.status} - ${error.response.data}`,
				);
			} else {
				setError(`Unknown error in getting generated objects: ${error}`);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchModified = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/modified");
			const modified: SceneObject[] = response.data.map(
				(p: ApiSceneObject) => ({
					base: {
						id: p._id,
						name: p.name,
						imgSrc: p.imageSrc,
						description: null,
						imageSets: p.imageSets,
						isUserMade: p.isUserMade,
						ontype: p.onType,
					},
					coordinates: p.coordinates,
					description: p.description,
					isReversed: p.isReversed,
				}),
			);
			setSceneObjects(modified);
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					`API Error in getting scene objects: ${error.response.status} - ${error.response.data}`,
				);
			} else {
				setError(`Unknown error in getting scene objects: ${error}`);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateItem = useCallback(async (id: string, object: SceneObject) => {
		setIsLoading(true);
		try {
			const url = `/modified/${id}`;
			const body = {
				name: object.name,
				description: object.description,
				imageSrc: object.imgSrc,
				itemFunction: object.itemFunction,
				additionalData: object.additionalData,
				isReversed: object.isReversed,
				coordinates: object.coordinate,
			};
			const response = await apiClient.patch(url, body);
			return response.data;
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					`API Error in modifying existing object: ${error.response.status} - ${error.response.data}`,
				);
			} else {
				setError(`Unknown error in modifying existing object: ${error}`);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addItem = useCallback(async (object: SceneObject) => {
		setIsLoading(true);
		try {
			const url = "/modified";
			const body = {
				name: object.name,
				description: object.description,
				imageSrc: object.imgSrc,
				itemFunction: object.itemFunction,
				additionalData: object.additionalData,
				isReversed: object.isReversed,
				coordinates: object.coordinate,
			};
			const response = await apiClient.post(url, body);
			return response.data;
		} catch (error) {
			if (isAxiosError(error)) {
				setError(
					`API Error in creating new object: ${error.response.status} - ${error.response.data}`,
				);
			} else {
				setError(`Unknown error in creating new object: ${error}`);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	return (
		<ObjectsContext.Provider
			value={{
				inventoryObjects,
				generatedObjects,
				sceneObjects,
				isLoading,
				error,
				updateItem,
				addItem,
			}}
		>
			{children}
		</ObjectsContext.Provider>
	);
};

export const useObjects = () => {
	const context = useContext(ObjectsContext);
	if (context === undefined) {
		throw new Error("usePosts must be used within a ObjectsProvider");
	}
	return context;
};
