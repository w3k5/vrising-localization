import { LanguageData } from "../interfaces/language-data.interface";

const attachLanguageNodeByGuid = (
	english: LanguageData,
	russian: LanguageData
) => {
	const englishNodes = english.Nodes;
	const russianNodes = russian.Nodes;

	const nodes = englishNodes.map((englishNode) => {
		const guid = englishNode.Guid;
		return {
			...englishNode,
			translate:
				russianNodes.find((russianNode) => russianNode.Guid === guid)?.Text ||
				"",
		};
	});

	return nodes;
};

export default attachLanguageNodeByGuid;
