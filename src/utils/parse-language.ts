import {
	LanguageData,
	LanguageNode,
} from "@interfaces/language-data.interface";

const getLanguageNodes = ({ Nodes }: LanguageData): LanguageNode[] => {
	return Nodes;
};

export default getLanguageNodes;
