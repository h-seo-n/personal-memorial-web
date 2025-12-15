const DEG_TO_RAD = Math.PI / 180;
const ROTATE_X_DEG = 55;
const ROTATE_Z_DEG = 45;
const COS_X = Math.cos(ROTATE_X_DEG * DEG_TO_RAD);
const SIN_Z = Math.sin(-ROTATE_Z_DEG * DEG_TO_RAD);
const COS_Z = Math.cos(-ROTATE_Z_DEG * DEG_TO_RAD);

const RIGHT_WALL_SKEW = 29.8;
const LEFT_WALL_SKEW = -29.8;

export const getIsometricCoordinates = (
	clientX: number,
	clientY: number,
	rect: DOMRect,
	elementSize: number,
): [number, number] => {
	// center of bounding box (dropsurface)
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	// position relative to center
	const dx = clientX - centerX;
	const dy = clientY - centerY;

	// inverse rotation
	const unrotatedX = dx * COS_Z - dy * SIN_Z;
	const unrotatedY = dx * SIN_Z + dy * COS_Z;

	// un-squash X = Inverse Projection
	const trueY = unrotatedY / COS_X;

	// Normalize: (Value / TotalSize) + 0.5
	const x = unrotatedX / elementSize + 0.5;
	const y = trueY / elementSize + 0.5;

	return [x, y];
};

export const getSkewedCoordinates = (
	clientX: number,
	clientY: number,
	rect: DOMRect,
	skewDeg: number,
): [number, number] => {
	const relX = clientX - rect.left;
	const relY = clientY - rect.top;

	const tanSkew = Math.tan(skewDeg * DEG_TO_RAD);

	const normalizedX = relX / rect.width;
	const xOffsetFromCenter = relX - rect.width / 2;
	const yShift = xOffsetFromCenter * tanSkew;

	const trueY = relY - yShift;
	const normalizedY = trueY / rect.height;

	return [normalizedX, normalizedY];
};

export const getStandardCoordinates = (
	clientX: number,
	clientY: number,
	rect: DOMRect,
): [number, number] => {
	return [
		(clientX - rect.left) / rect.width,
		(clientY - rect.top) / rect.height,
	];
};
