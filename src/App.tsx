import React from "react";
import { useState } from "react";
import {
	Table,
	Input,
	Button,
	notification,
	Upload,
	Layout,
	Divider,
} from "antd";
import {
	InboxOutlined,
	GithubFilled,
	FireFilled,
	DollarCircleFilled,
} from "@ant-design/icons";
import { DebounceInput } from "react-debounce-input";
import "./App.css";
import attachLanguageNodeByGuid from "./utils/compare-languages";
import * as englishLanguageData from "./assets/languages/English.json";
import * as russianLanguageData from "./assets/languages/Russian.json";
import { LanguageTranslateNode } from "./interfaces/language-data.interface";
import generateTranslateFile from "./utils/generate-translate";
import downloadFile from "./utils/download";
import { RcFile } from "antd/lib/upload";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Footer } = Layout;

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

	const onClickDefaultLanguage = () => {
		try {
			const parsedData = attachLanguageNodeByGuid(
				englishLanguageData,
				russianLanguageData
			);
			setLanguageData(parsedData);
		} catch (error) {
			openNotificationWithIcon({});
		}
	};

	const onDownload = () => {
		const data = generateTranslateFile(englishLanguageData, languageData);
		downloadFile(data, "Russian");
	};

	const downloadLatestTranslation = () => {
		downloadFile(russianLanguageData, "Russian");
	};

	const onDropOrSelectFile = (file: RcFile) => {
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
				<div className="container">
					<div className="edit-table">
						<Table
							dataSource={languageData}
							columns={columns}
							rowKey="Guid"
							scroll={{ y: "calc(100vh - 272px)" }}
							tableLayout="fixed"
							sticky
							bordered
						/>
						<div className="table-actions">
							<Button type="primary" onClick={onDownload}>
								Скачать
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="dragger-container">
					<div className="dragger-wrapper">
						<Dragger {...props} beforeUpload={onDropOrSelectFile}>
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
					<div className="default-language block">
						<p>
							Или запустите перевод от
							<a href="https://steamcommunity.com/id/m9coclan">JloKo </a>
							для редактирования
						</p>
						<div className="buttons">
							<Button onClick={onClickDefaultLanguage}>Запустить</Button>
						</div>
						<Button onClick={downloadLatestTranslation} type="primary">
							Скачать последнюю версию перевода
						</Button>
						<Divider />
						<p className="instruction">
							Чтобы запустить локализацию перенесите файл в
							<ol>
								<li>
									<span className="ant-typography">
										<code>
											x:\SteamLibrary\steamapps\common\VRising\VRising_Data\StreamingAssets\Localization
										</code>
									</span>
								</li>
								<li>Выберите русский язык в настройках игрыы</li>
							</ol>
						</p>
					</div>
				</div>
			)}
			<footer>
				<Footer>
					<div className="container">
						<div className="links">
							<a
								href="https://github.com/w3k5/vrising-localization"
								target="_blank"
								className="github"
								rel="noreferrer"
							>
								<GithubFilled /> GitHub Source Code
							</a>
							<a
								href="https://steamcommunity.com/id/480248681"
								target="_blank"
								className="steam"
								rel="noreferrer"
							>
								<FireFilled /> My Steam Account
							</a>
							<a
								href="https://yoomoney.ru/to/4100117492734109"
								target="_blank"
								className="donate"
								rel="noreferrer"
							>
								<DollarCircleFilled /> Поддержать создателя приложения
							</a>
							<a
								href="https://discord.com/invite/sathQfW"
								target="_blank"
								className="donate"
								rel="noreferrer"
							>
								<DollarCircleFilled /> Поддержать JloKo напишите ему в дискорд
							</a>
						</div>
					</div>
				</Footer>
			</footer>
		</div>
	);
}

export default App;
