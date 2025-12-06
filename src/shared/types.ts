// interface Theme {
//   wallColor: string; // #ff0000 처럼 hex 표기로 통일
//   floorColor: string;
//   weather: 'sunny' | 'cloudy' | 'night' | 'snowing' | 'raining' | 'sunset'; // 필요 시 더 추가
// }

// 상호작용 종류 - 넷 중 하나
export type ItemFunction = "Gallery" | "Link" | "Board" | null;

export type OnType = "Floor" | "LeftWall" | "RightWall";

export interface DropHandler {
	onDropNew: (item: BaseObject, coordinates: [number, number]) => void;
	onMove: (instanceId: string, newCoordinates: [number, number]) => void;
}

export interface Music {
	url: string;
	name: string;
}
export interface Theme {
	floorColor: string;
	leftWallColor: string;
	rightWallColor: string;
	weather: string;
	backgroundMusic: Music;
}

export interface ImageSet {
	_id: string;
	name: string;
	color: string; // e.g. #ffffff
	src: string; // image source url
}

// AI가 생성해야 하는 / 인벤토리에서 기본으로 가지고 있어야 하는 항목들
export interface BaseObject {
	id: string;
	name: string;
	currentImageSet: ImageSet;
	description?: string;
	imageSets: ImageSet[];
	isUserMade: boolean;
	ontype: OnType;
}

// 팝업에서 받는 (유저가 결정하는) 추가적인 항목들
export interface SceneObject extends BaseObject {
	itemFunction: ItemFunction;
	isReversed: boolean;
	additionalData?: string;
	coordinate: {
		x: number;
		y: number;
	}; // [x, y] coordinates
}

// // 배치한 오브젝트의 데이터
// export interface SceneObject {
// 	id: string; // unique id for object
// 	base: BaseObject;
// 	data: PlacedObjectData;
// }
