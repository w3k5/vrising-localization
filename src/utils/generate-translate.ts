import {
	LanguageData,
	LanguageTranslateNode,
} from "../interfaces/language-data.interface";

const getClearNode = (node: LanguageTranslateNode) => {
	return {
		Guid: node.Guid,
		Text: node.translate,
	};
};

const getClearLanguageNodes = (nodes: LanguageTranslateNode[]) => {
	return nodes.map(getClearNode);
};

const generateTranslateFile = (
	defaultLanguage: LanguageData,
	translated: LanguageTranslateNode[]
) => {
	const clearNodes = getClearLanguageNodes(translated);
	const { Codes } = defaultLanguage;
	return { Codes, Nodes: clearNodes };
};

export default generateTranslateFile;
