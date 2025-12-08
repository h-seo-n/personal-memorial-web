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
	AdditionalData,
	BaseObject,
	BoardData,
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
	delLoading: boolean;
	generateLoading: boolean;
	error: string | null;
	handleAxiosError: (error: unknown, context: string) => void;

	fetchModified: () => Promise<void>;
	updateBoard: (id: string, board: BoardData) => Promise<void>;
	updateModified: (id: string, object: SceneObject) => Promise<void>;
	addModified: (object: SceneObject) => Promise<SceneObject>;

	generateObject: (
		q1: string,
		a1: string,
		q2: string,
		a2: string,
	) => Promise<BaseObject>;
	addGenerated: (id: string) => Promise<void>;
	deleteModified: (id: string, isUserMade: boolean) => Promise<void>;
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
	additionalData?: AdditionalData;
	coordinates: { x: number; y: number };
}

interface ApiModifiedCreateRequest {
	name: string;
	itemFunction: ItemFunction;
	coordinates: { x: number; y: number };
	isReversed: boolean;
	description?: string | null;
	additionalData?: AdditionalData | null;
	originalObjectId: string;
	currentImageSetId: string;
	onType: OnType;
}
interface ApiModifiedEditRequest {
	name?: string;
	description?: string;
	itemFunction?: string;
	additionalData?: AdditionalData;
	isReversed?: boolean;
	coordinates?: { x: number; y: number };
	currentImageSetId?: string;
	onType: OnType;
}

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

const ObjectsContext = createContext<ObjectContextType | undefined>(undefined);

export const ObjectsProvider = ({ children }: { children: ReactNode }) => {
	const [inventoryObjects, setInventoryObjects] = useState<BaseObject[]>([]);
	const [generatedObjects, setGeneratedObjects] = useState<BaseObject[]>([]);
	const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [generateLoading, setGenerateLoading] = useState(false);
	const [delLoading, setDelLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user, fetchUser } = useAuth();

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

	const updateBoard = useCallback(
		async (id: string, board: BoardData) => {
			try {
				const response = await apiClient.patch(`/modified/${id}`, {
					additionalData: {
						data: {
							title: board.title,
							description: board.description,
							items: board.items,
						},
					},
				});

				const updatedObject = mapApiModifiedToSceneObject(response.data);

				// re-write client with server response
				setSceneObjects((prev) =>
					prev.map((obj) => (obj.id === id ? updatedObject : obj)),
				);
			} catch (error) {
				handleAxiosError(error, "update board");
			}
		},
		[handleAxiosError],
	);

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

				if (object.itemFunction !== undefined && object.itemFunction !== null) {
					body.itemFunction = object.itemFunction;
					if (object.additionalData)
						body.additionalData = object.additionalData;
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

	/**
	 * 1차/2차 질문 & 답변을 모두 이용해
	 * 백엔드에서 객체를 생성하고, mapApiToBaseObject로 변환해서 돌려줍니다.
	 */
	const generateObject = useCallback(
		async (
			question1: string,
			answer1: string,
			question2: string,
			answer2: string,
		) => {
			setGenerateLoading(true);
			try {
				const query = `Q1:${question1}, A1:${answer1} / Q2:${question2}, A2:${answer2}`;
				const response = await apiClient.post("/object", {
					content: query,
				});

				const generatedObject = mapApiToBaseObject(response.data);
				return generatedObject;
			} catch (error) {
				handleAxiosError(error, "object generation");
			} finally {
				setGenerateLoading(false);
			}
		},
		[handleAxiosError],
	);

	/**
	 * 팝업에서 "내 아이템에 추가" -> generated에 저장.(내아이템>생성)
	 */
	const addGenerated = useCallback(
		async (id: string) => {
			setGenerateLoading(true);
			try {
				const response = await apiClient.post("/object/add", {
					objectId: id,
				});
				await fetchGenerated(); // 내 아이템 > 생성 목록
				await fetchUser(); // 다음 questionIndex
			} catch (error) {
				handleAxiosError(error, "add generated object");
			} finally {
				setGenerateLoading(false);
			}
		},
		[fetchGenerated, handleAxiosError, fetchUser],
	);

	const deleteModified = useCallback(
		async (id: string, isUserMade: boolean) => {
			setDelLoading(true);
			try {
				await apiClient.delete(`/modified/${id}`);
				if (isUserMade) await fetchGenerated();
				await fetchModified();
				await fetchUser();
			} catch (error) {
				handleAxiosError(error, "delete modified object");
			} finally {
				setDelLoading(false);
			}
		},
		[fetchModified, fetchUser, handleAxiosError, fetchGenerated],
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
			handleAxiosError,
			fetchModified,
			updateBoard,
			updateModified,
			addModified,
			generateObject,
			addGenerated,
			generateLoading,
			delLoading,
			deleteModified,
		}),
		[
			inventoryObjects,
			generatedObjects,
			sceneObjects,
			isLoading,
			error,
			handleAxiosError,
			fetchModified,
			updateBoard,
			updateModified,
			addModified,
			generateObject,
			addGenerated,
			generateLoading,
			delLoading,
			deleteModified,
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
