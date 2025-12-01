import { isAxiosError } from "axios";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import apiClient from "../shared/api";
import type {
	BaseObject,
	ImageSet,
	ItemFunction,
	OnType,
	SceneObject,
} from "../shared/types";
import { useAuth } from "./AuthContext";

interface ObjectContextType {
	inventoryObjects: BaseObject[];
	generatedObjects: BaseObject[];
	sceneObjects: SceneObject[];

	isLoading: boolean;
	error: string | null;

	fetchModified: () => Promise<void>;
	updateModified: (id: string, object: SceneObject) => Promise<void>;
	addModified: (object: SceneObject) => Promise<SceneObject>;
}

interface CurrentImageSet {
	name: string;
	color: string;
	src: string;
}

interface ApiBaseObject {
	_id: string;
	name: string;
	currentImageSet: CurrentImageSet;
	description?: string;
	imageSets: ImageSet[];
	isUserMade: boolean;
	onType: OnType;
}
interface ApiSceneObject extends ApiBaseObject {
	itemFunction: ItemFunction;
	isReversed: boolean;
	additionalData?: string;
	coordinates: { x: number; y: number };
}

export interface ApiModifiedCreateRequest {
	name: string;
	itemFunction: ItemFunction;
	coordinates: { x: number; y: number };
	isReversed: boolean;
	description?: string | null;
	additionalData?: string | null;
	originalObjectId: string;
	currentImageSetId: string;
	onType: OnType;
}
export interface ApiModifiedEditRequest {
	name?: string;
	description?: string;
	itemFunction?: string;
	additionalData?: string;
	isReversed?: boolean;
	coordinates?: { x: number; y: number };
	currentImageSetId?: string;
	onType: OnType;
}

const ObjectsContext = createContext<ObjectContextType | undefined>(undefined);

const findCurrentImageSetId = (obj: ApiBaseObject) => {
	const id = obj.imageSets.find((i) => i.name === obj.currentImageSet.name)._id;
	return id;
};

export const mapApiToBaseObject = (obj: ApiBaseObject): BaseObject => ({
	id: obj._id,
	name: obj.name,
	currentImageSet: {
		_id: findCurrentImageSetId(obj),
		...obj.currentImageSet,
	},
	description: obj.description,
	imageSets: obj.imageSets,
	isUserMade: obj.isUserMade,
	ontype: obj.onType,
});

const mapApiModifiedToSceneObject = (obj: ApiSceneObject): SceneObject => ({
	...mapApiToBaseObject(obj),
	coordinate: { x: obj.coordinates.x, y: obj.coordinates.y },
	itemFunction: obj.itemFunction,
	isReversed: obj.isReversed,
	additionalData: obj.additionalData ?? undefined,
});

export const ObjectsProvider = ({ children }: { children: ReactNode }) => {
	const [inventoryObjects, setInventoryObjects] = useState<BaseObject[]>([]);
	const [generatedObjects, setGeneratedObjects] = useState<BaseObject[]>([]);
	const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { user } = useAuth();

	const handleAxiosError = useCallback((error: unknown, context: string) => {
		if (isAxiosError(error)) {
			const status = error.response?.status;
			const data = error.response?.data;
			if (status) {
				setError(`API Error (${context}): ${status} - ${JSON.stringify(data)}`);
			} else {
				setError(`Network Error (${context}): ${error.message}`);
			}
		} else {
			setError(`Unknown error (${context}): ${String(error)}`);
		}
	}, []);

	const fetchInventory = useCallback(async () => {
		const response = await apiClient.get<ApiBaseObject[]>("/object/basic");
		const inventory: BaseObject[] = response.data.map(mapApiToBaseObject);
		setInventoryObjects(inventory);
	}, []);

	const fetchGenerated = useCallback(async () => {
		const response = await apiClient.get<ApiBaseObject[]>("/object");
		const generated: BaseObject[] = response.data.map(mapApiToBaseObject);
		setGeneratedObjects(generated);
	}, []);

	const fetchModified = useCallback(async () => {
		const response = await apiClient.get("/modified");
		const modified: SceneObject[] = response.data.map(
			mapApiModifiedToSceneObject,
		);
		setSceneObjects(modified);
	}, []);

	const updateModified = useCallback(
		async (id: string, object: SceneObject) => {
			// 낙관적 업데이트 : 서버 반응 보기 전 클라이언트부터 일단 업데이트
			const prevObject = sceneObjects.find((obj) => obj.id === id); // backup prev value (object before edit)
			if (!prevObject) return;

			setSceneObjects((prev) =>
				prev.map((obj) => (obj.id === id ? object : obj)),
			);

			try {
				const url = `/modified/${id}`;

				const body: ApiModifiedEditRequest = {
					onType: object.ontype,
				};

				if (object.name) body.name = object.name;
				if (object.description) body.description = object.description;
				if (object.additionalData) body.additionalData = object.additionalData;

				if (object.itemFunction !== undefined && object.itemFunction !== null) {
					body.itemFunction = object.itemFunction;
				}
				if (typeof object.isReversed === "boolean") {
					body.isReversed = object.isReversed;
				}

				if (
					object.coordinate &&
					typeof object.coordinate.x === "number" &&
					typeof object.coordinate.y === "number"
				) {
					body.coordinates = {
						x: object.coordinate.x,
						y: object.coordinate.y,
					};
				}

				if (object.currentImageSet?._id) {
					body.currentImageSetId = object.currentImageSet._id;
				}

				console.log("PATCH body", body);
				const response = await apiClient.patch(url, body);
				const updatedObject = mapApiModifiedToSceneObject(response.data);

				// re-write client with server response
				setSceneObjects((prev) =>
					prev.map((obj) => (obj.id === id ? updatedObject : obj)),
				);
			} catch (error) {
				handleAxiosError(error, "update modified object");
				// revert back if error
				setSceneObjects((prev) =>
					prev.map((obj) => (obj.id === id ? prevObject : obj)),
				);
			}
		},
		[handleAxiosError, sceneObjects],
	);

	const addModified = useCallback(
		async (object: SceneObject) => {
			setIsLoading(true);
			try {
				const url = "/modified";
				const body: ApiModifiedCreateRequest = {
					name: object.name,
					itemFunction: object.itemFunction,
					coordinates: object.coordinate,
					isReversed: object.isReversed,
					// description: object.description ? object.description : null,
					// additionalData: object.additionalData ? object.additionalData : null,
					originalObjectId: object.id,
					currentImageSetId: object.currentImageSet._id,
					onType: object.ontype,
				};
				if (object.description) body.description = object.description;
				if (object.additionalData) body.additionalData = object.additionalData;

				const response = await apiClient.post(url, body);
				const addedObject: SceneObject = mapApiModifiedToSceneObject(
					response.data,
				);
				setSceneObjects((prev) => [...prev, addedObject]);
				return addedObject;
			} catch (error) {
				handleAxiosError(error, "create modified object");
			} finally {
				setIsLoading(false);
			}
		},
		[handleAxiosError],
	);

	// 앱 렌더 시 서버에서 받아올 아이템들 업데이트
	useEffect(() => {
		const loadNull = () => {
			// 인벤토리 : 기본적으로 존재
			setSceneObjects([]); // 내아이템 > NOW
			setGeneratedObjects([]); // 내아이템 > 생성
		};
		const loadAll = async () => {
			setIsLoading(true);
			try {
				await Promise.all([
					fetchInventory(),
					fetchGenerated(),
					fetchModified(),
				]);
			} finally {
				setIsLoading(false);
			}
		};
		if (!user) loadNull();
		else loadAll();
	}, [user, fetchInventory, fetchGenerated, fetchModified]);

	const value = useMemo(
		() => ({
			inventoryObjects,
			generatedObjects,
			sceneObjects,
			isLoading,
			error,
			fetchModified,
			updateModified,
			addModified,
		}),
		[
			inventoryObjects,
			generatedObjects,
			sceneObjects,
			isLoading,
			error,
			fetchModified,
			updateModified,
			addModified,
		],
	);

	return (
		<ObjectsContext.Provider value={value}>{children}</ObjectsContext.Provider>
	);
};

export const useObjects = () => {
	const context = useContext(ObjectsContext);
	if (context === undefined) {
		throw new Error("useObjects must be used within a ObjectsProvider");
	}
	return context;
};
