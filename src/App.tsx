import React from "react";
import { useState } from "react";
import { Table, Input, Button, notification, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { DebounceInput } from "react-debounce-input";
import "./App.css";
import attachLanguageNodeByGuid from "./utils/compare-languages";
import * as englishLanguageData from "./assets/languages/English.json";
import { LanguageTranslateNode } from "./interfaces/language-data.interface";
import generateTranslateFile from "./utils/generate-translate";
import downloadFile from "./utils/download";
import { RcFile } from "antd/lib/upload";

const { TextArea } = Input;
const { Dragger } = Upload;

const props = {
	name: "file",
	multiple: false,
	accept: ".json",
	showUploadList: false,
};

const openNotificationWithIcon = ({
	message,
	description,
}: {
	message?: string;
	description?: string;
}) => {
	notification.error({
		message: message || "Неверный файл!",
		description: description || "Загрузите валидный файл локализации!",
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

	const handleChange = (file: RcFile) => {
		const fileReader = new FileReader();
		fileReader.readAsText(file, "UTF-8");
		fileReader.onload = (e) => {
			if (!e.target) {
				openNotificationWithIcon({
					message: "Error",
					description: "File is empty!",
				});
				return;
			}
			try {
				const parsedData = attachLanguageNodeByGuid(
					englishLanguageData,
					JSON.parse(e.target.result as string)
				);
				setLanguageData(parsedData);
			} catch (error) {
				openNotificationWithIcon({});
			}
		};
	};

	return (
		<div className={languageData.length ? "App Editor" : "App Dragger"}>
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
				<div className="dragger-wrapper">
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
				</div>
			)}
		</div>
	);
}

export default App;
