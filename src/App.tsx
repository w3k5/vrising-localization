import React, { useRef } from "react";
import { useState } from "react";
import { Table, Input, Button, notification, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { DebounceInput } from "react-debounce-input";
import "./App.css";
import attachLanguageNodeByGuid from "./utils/compare-languages";
import * as englishLanguageData from "./assets/languages/English.json";
import { LanguageTranslateNode } from "./interfaces/language-data.interface";
import generateTranslateFile from "./utils/generate-translate";
import downloadFile from "./utils/download";

const { TextArea } = Input;
const { Dragger } = Upload;

const props = {
	name: "file",
	multiple: false,
	accept: ".json",
	showUploadList: false,
	onDrop(e: any) {
		console.log("Dropped files", e.dataTransfer.files);
	},
};

const openNotificationWithIcon = () => {
	notification.error({
		message: "Неверный файл!",
		description: "Загрузите валидный файл локализации!",
	});
};
interface InputChangeHandlerInterface {
	text: string;
	record: LanguageTranslateNode;
	index: number;
	event: string;
}

function App() {
	const [languageData, setLanguageData] = useState<LanguageTranslateNode[]>([]);
	const [languageFile, setLanguageFile] = useState("");
	const inputRef = useRef(null);

	const onInputChange: (options: InputChangeHandlerInterface) => void = ({
		event,
		record,
	}) => {
		const nodeCandidate = languageData.find(
			(node) => node.Guid === record.Guid
		);

		if (nodeCandidate) {
			const editedNode = { ...nodeCandidate, translate: event };
			setLanguageData(
				languageData.map((node) =>
					node.Guid === editedNode.Guid ? editedNode : node
				)
			);
		}
	};

	const columns = [
		{
			title: "English",
			dataIndex: "Text",
			key: "Text",
			width: "50%",
		},
		{
			title: "Russian",
			dataIndex: "translate",
			key: "translate",
			width: "50%",
			render: (text: string, record: LanguageTranslateNode, index: number) => (
				<DebounceInput
					debounceTimeout={300}
					onChange={(event) =>
						onInputChange({ text, record, index, event: event.target.value })
					}
					value={text}
					element={TextArea as any}
				/>
			),
		},
	];

	const onDownload = () => {
		const data = generateTranslateFile(englishLanguageData, languageData);
		downloadFile(data, "Russian");
	};

	const resetInput = () => {
		if (inputRef.current) {
			(inputRef.current as any).value = "";
		}
	};

	const handleChange = (e: any) => {
		const fileReader = new FileReader();
		fileReader.readAsText(e, "UTF-8");
		fileReader.onload = (e) => {
			console.log(e);
			setLanguageFile((e.target as any).result);
			try {
				const parsedData = attachLanguageNodeByGuid(
					englishLanguageData,
					JSON.parse((e.target as any).result)
				);
				setLanguageData(parsedData);
			} catch (error) {
				console.log(inputRef);
				resetInput();
				openNotificationWithIcon();
				setLanguageFile("");
			}
		};
	};

	return (
		<div className="App">
			{languageData.length ? (
				<div className="edit-table">
					<Table
						dataSource={languageData}
						columns={columns}
						rowKey="Guid"
						scroll={{ y: "calc(100vh - 200px)" }}
						tableLayout="fixed"
						sticky
					/>
					<div className="download-button">
						<Button type="primary" onClick={onDownload}>
							Скачать
						</Button>
					</div>
				</div>
			) : (
				<Dragger {...props} beforeUpload={handleChange}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">
						Нажмите или перетащите файл для загрузки
					</p>
					<p className="ant-upload-hint">
						Поддерживает только валидный файл локализации
						<br />
					</p>
				</Dragger>
			)}
		</div>
	);
}

export default App;
