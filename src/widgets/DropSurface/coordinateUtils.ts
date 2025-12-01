const DEG_TO_RAD = Math.PI / 180;
const ROTATE_X_DEG = 60;
const ROTATE_Z_DEG = 45;
const FLOOR_SIZE = 540;
const COS_X = Math.cos(ROTATE_X_DEG * DEG_TO_RAD);
const SIN_Z = Math.sin(-ROTATE_Z_DEG * DEG_TO_RAD);
const COS_Z = Math.cos(-ROTATE_Z_DEG * DEG_TO_RAD);

export const getIsometricCoordinates = (
	clientX: number,
	clientY: number,
	rect: DOMRect,
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

	// calculate scale (clamp to 0~1)
	const internalSize = rect.width / Math.sqrt(2);

	// Normalize: (Value / TotalSize) + 0.5
	const x = unrotatedX / internalSize + 0.5;
	const y = trueY / internalSize + 0.5;

	return [x, y];
};

export const getStandardCoordinates = (
	clientX: number,
	clientY: number,
	rect: DOMRect,
): [number, number] => {
	const x = (clientX - rect.left) / rect.width;
	const y = (clientY - rect.top) / rect.height;

	return [x, y];
};
