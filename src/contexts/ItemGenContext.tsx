import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
	useState,
} from "react";

interface ItemGenContextType {
	justGenerated: boolean;
	setJustGenerated: Dispatch<SetStateAction<boolean>>;

	ontype: "Floor" | "Wall";
	setOntype: Dispatch<SetStateAction<"Floor" | "Wall">>;
}

const ItemGenContext = createContext<ItemGenContextType | undefined>(undefined);

export const ItemGenProvider = ({ children }: { children: ReactNode }) => {
	const [justGenerated, setJustGenerated] = useState(false);
	const [ontype, setOntype] = useState<"Floor" | "Wall">("Floor");

	return (
		<ItemGenContext.Provider
			value={{ justGenerated, setJustGenerated, ontype, setOntype }}
		>
			{children}
		</ItemGenContext.Provider>
	);
};

export const useItemGen = () => {
	const ctx = useContext(ItemGenContext);
	if (!ctx) {
		throw new Error("useItemGen must be used within ItemGenProvider");
	}
	return ctx;
};
