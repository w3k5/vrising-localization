export interface ColorCode {
	Key: string;
	Value: string;
	Description: string;
}

export interface LanguageNode {
	Guid: string;
	Text: string;
}

export interface LanguageData {
	Codes: ColorCode[];
	Nodes: LanguageNode[];
}

export type LanguageTranslateNode = LanguageNode & { translate: string };
