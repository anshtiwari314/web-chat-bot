import React, { useRef, useEffect } from "react";
import Send from "./Sent_message";
import Receive from "./receive_message";
import Table from './Table_Message';
import Input from "./Input_message";
import Button from "./Send_btn";
import Axios from "axios";
import "../css/chatbot.css";
import ButtonMessage from "./btn_message";
import Cookies from "js-cookie";
import DownButton from "./DownButton";
import ReactBottomsheet from "react-bottomsheet";
import { Dot } from 'react-animated-dots';
import Image_message from "./Image_message";
import useLocalStorage, {clearFromLocalStorage} from "../utils/useLocalStorage";
import {uuid} from "../utils/utils";

function ChatWindow(props) {
	//"004f1836-15ce-11eb-a4c1-023dd4e3dfca"
	//ToGetAllMessages-Recieve,Send,ButtonsUI,Card
	const [value, setValue] = useLocalStorage('value', []);
	//ButtonUIArray which will disappear after click
	const [buttonValue, setButtonValue] = useLocalStorage('buttonValue', []);
	//News UI
	const [newsValue, setnewsValue] = useLocalStorage('newsValue', []);
	//ThreeDots loading Animation
	const [loader, setLoader] = useLocalStorage('loader', -1);
	//DownButtonList which will keep on changing.
	const [jcb_down_button_data, set_jcb_down_button_data] = useLocalStorage('jcb_down_button_data', []);
	//DownButtonList Checker
	const [sheet, setBottomSheet] = useLocalStorage('sheet', { bottomSheet: false });
	//1 Random Id per session
	const [conversation_id, set_conversation_id] = useLocalStorage('conversation_id', -1);
	//TextArea while we type
	const [textAreaInput, setTextAreaInput] = useLocalStorage('textAreaInput', false);
	//ScrollTo 1st recieved Box after we recieve msg
	const [scrollTo, setScrollTo] = useLocalStorage('scrollTo', 0);
	//Maximize ChatBot using maximize icon state change of className
	const [maximizeChatBot, setMaximizeChatBot] = useLocalStorage('maximizeChatBot', "");
	//change maximize or minimize icon of chatbot
	const [maxOrMinIcon, setMaxOrMinIcon] = useLocalStorage('maxOrMinIcon', "/images/maximize.png");
	//Escape Button click
	const [escapeButton, setEscapeButton] = useLocalStorage('escapeButton', false);

	const allStateKeys = ['value', 'buttonValue', 'newsValue', 'loader', 'jcb_down_button_data', 'sheet', 'conversation_id', 'textAreaInput', 'scrollTo', 'maximizeChatBot', 'maxOrMinIcon', 'escapeButton', 'activeTabs'];

	const tabId = sessionStorage.getItem('_jcb_tabId') ? sessionStorage.getItem('_jcb_tabId') : uuid();

	const query = useRef("")
	/**using Escape button to make downbuttonList disappear*/
	useEffect(() => {
		//console.log('handleEsc restted')
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				
				setBottomSheet({ bottomSheet: false })
				setEscapeButton(escapeButton => { return !escapeButton })
			}
		};
		window.addEventListener('keydown', handleEsc);
		return ()=>window.removeEventListener('keydown',handleEsc)
	}, []);
	/** */

	useEffect(() => {
		window.addEventListener("beforeunload", function () {
			sessionStorage.removeItem('_jcb_tabId');
			const storedTabs = localStorage.getItem('_jcb_activeTabs');
			const activeTabs = storedTabs ? JSON.parse(storedTabs) : [];
			const index = activeTabs.indexOf(tabId);
			if(index != -1) {
				activeTabs.splice(index, 1);
			}
			if(activeTabs.length > 0) {
				localStorage.setItem('_jcb_activeTabs', JSON.stringify(activeTabs));
			} else {
			clearFromLocalStorage(allStateKeys);
			}
		});
	}, []);

	/*Scroll to Bottom Easy UI*/
	const messagesEndRef2 = useRef(null);


	/**will return Current Time */
	const startTime = () => {
		var dt = new Date();
		var h = dt.getHours(),
			m = dt.getMinutes();
		var time;

		if (h === 12) {
			time = h + ":" + (m < 10 ? "0" + m : m) + " PM";
		} else {
			time =
				h > 12
					? (h - 12 < 10 ? "0" + (h - 12) : h - 12) +
					":" +
					(m < 10 ? "0" + m : m) +
					" PM"
					: (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + " AM";
		}

		return time;
	};

	/**Generate Random Conversation Id for session */
	function Conversation_id_function() {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < 32; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	/** when user presses any message UI button*/
	function onclick(event) {
		console.log("onclick event triggred",getSessionId())
		payload = {
			session: getSessionId(),
			query: event,
			type: "sent",
			time: startTime(),
			count: value.length,
			conversationId: conversation_id,
			pageUrl: window.location.href
		};
		clickButton()
		// console.log(event);
		setButtonValue([]);
		set_jcb_down_button_data([]);
		isClicked(true);
	}

	/*Mapping Text(speech) messages values which are in value array */

	var receives = value.map((m, i) => {
		// console.log("type:" + m.type + " pos:" + i);
		if (m.query !== "") {
			if (m.type == "receive") {
				return <Receive key={i*43} query={m.query} time={m.time} />;

			} else if (m.type == "sent") {
				if (i === scrollTo) {
					return <React.Fragment key={i*43} >
						<div ref={messagesEndRef2} />
						<Send query={m.query} time={m.time} />

						{messagesEndRef2.current ? messagesEndRef2.current.scrollIntoView({ behavior: "smooth" }) : null}
					</React.Fragment>
				}
				return <Send key={i} query={m.query} time={m.time} />;
			}
			else if (m.type === "card") {
				return <Table key={i*43} query={m.query} time={m.time} tableClick={(m) => { tableHyperLinkClick(m) }} />;
			}
			else if (m.type === "image") {
				return <Image_message link={m.query} key={i*43}/>
			}
		} else {
			return null;
		}
	});


	/*Mapping ButtonUI(replies) messages values which are in buttonValue array */
	var recievesButton = buttonValue.map((m, i) => {
		if (m.type == "button") {
			return (
				<ButtonMessage
					key={i*49}
					query={m.query}
					click={() => {
						onclick(m.query);
					}}
					newTabUrl={m.newTabUrl}
				/>
			);
		}
	});
	// console.log(recievesButton.length+"recieve:");
	/*OnChange in Input  function to get the value from input*/
	var payload = {
		session: getSessionId(),
		query: query.current,
		type: "sent",
		time: startTime(),
		count: value.length,
		conversationId: conversation_id,
		pageUrl: window.location.href
	};

	/**when we write something on input field, event function will change the value constantly */
	function submitForm(event) {
		query.current = event;
		payload = {
			session: getSessionId(),
			query: event,
			type: "sent",
			time: startTime(),
			count: value.length,
			conversationId: conversation_id,
			pageUrl: window.location.href
		};
	}

	/*API CALL for first GoodMorning messages when user open the chat! */

	useEffect(() => {
		if(tabId){
			sessionStorage.setItem('_jcb_tabId', tabId);
			const storedTabs = localStorage.getItem('_jcb_activeTabs')
			const activeTabs = storedTabs ? JSON.parse(storedTabs) : [];
			if(!activeTabs.includes(tabId)){
				localStorage.setItem('_jcb_activeTabs', JSON.stringify([...activeTabs, tabId]))
			}
		}
		// if(conversation_id !== -1) 
		// 	return true;
		
		if(window.location.pathname === "/mf-transaction/Category") {
			setTimeout(initializeChat, 10000);
		} else {
			initializeChat();
		}
	}, []);

	function getSessionId() {
		let user 
		if(props.localKey){
			 user = localStorage.getItem(props.localKey)
		}else {
			 user = Cookies.get(props.cookieKey)
		}
		
		//console.log("just for testing",props,props.localKey,user)
		return user ? user : -1;
		
	}

	function initializeChat() {
		var conversation = Conversation_id_function();
		set_conversation_id(conversation)
		setLoader(1);
		payload = {
			session: getSessionId(),
			query: "hi!",
			type: "sent",
			time: startTime(),
			count: value.length,
			conversationId: conversation,
			pageUrl: window.location.href
		};
		Axios.post(props.url, payload)
			.then((success) => {
				var sp = [];
				var btn = [];
				var actionText = [];
				var trial = [];
				success.data.result.fulfillment.data.DownButton.GenerativeQuestion.map(
					(m, i) => {
						if (trial.length < 10) trial.push(m);
					}
				);
				set_jcb_down_button_data([].concat(trial));
				success.data.result.fulfillment.messages.map((m) => {
					if (m.type === 0 && m.speech !== "") {
						m.speech.map((mm) => {
							var inital_message = {
								session: getSessionId(),
								query: mm,
								type: "receive",
								time: startTime(),
								count: value.length,
								conversationId: conversation
							};
							sp.push(inital_message);
						});
					} else if (m.type === 2 || m.type === 5) {
						m.replies.map((mm) => {
							var inital_message = {
								session: getSessionId(),
								query: mm,
								newTabUrl: m.type === 5 ? m.urls[0] : null,
								type: "button",
								time: startTime(),
								count: value.length,
								conversationId: conversation
							};
							btn.push(inital_message);
						});
					}
					else if (m.type === 3) {
						var inital_message = {
							session: getSessionId(),
							query: m.speech,
							type: "image",
							time: startTime(),
							count: value.length,
							conversationId: conversation
						};
						sp.push(inital_message);
					} else if (m.type === 4 && m.speech !== "") {
						var inital_message = {
							session: getSessionId(),
							query: m.speech,
							type: "receive",
							time: startTime(),
							count: value.length,
							conversationId: conversation
						};
						actionText.push(inital_message);
					}
				});
				setValue([...value].concat(sp).concat(actionText));
				setButtonValue([].concat(btn));
				setLoader(-1)
			})
			.catch((error) => {
				var errors = "";
				if (error.message.includes("Network")) errors = "There's a technical issue. Please check back in some time."
				else errors = "Oops! please Please write something..."
				var inital_message = {
					session: getSessionId(),
					query: errors,
					type: "receive",
					time: startTime(),
					count: value.length,
					conversationId: conversation_id
				};
				setValue([...value, inital_message]);
				setLoader(-1);
				console.log(error);
			});
	}
	/*After clicking on send either by pressing enter or by pressing send button*/

	function clickButton() {
		setTextAreaInput(!textAreaInput)
	}

	function isClicked(bool) {
		//console.log('is clicked function clicked')
		setScrollTo(value.length);

		setBottomSheet({ bottomSheet: false });
		setLoader(1);
		var count = 1;
		console.log("isClicked: request: ",payload);
		console.log(payload);
		if (
			payload.query.toString().trim() === undefined ||
			payload.query.toString().trim() === null ||
			payload.query.toString().trim() === ""
		) {
			console.log(
				"isClicked: query is blank, please enter something in textarea",payload
			);
			setLoader(-1);
		} else {
			setValue([...value, payload]);
			Axios.post(props.url, payload)
				.then((success) => {

					// console.log("printed");
					//type==0 for text
					var sp = [];
					//type==2 for button message
					var btn = [];
					var actionText = [];
					//type==1 for news
					var news = [];
					console.log(
						"isClicked: inside success of abcl.vitt.ai fetching api "
					);

					/**Table Data */
					var table_Data = {
						session: getSessionId(),
						query: {},
						type: "card",
						time: startTime(),
						count: value.length,
						conversationId: conversation_id
					};
					var flag = false;
					var table_pos = false;
					if (success.data.result.fulfillment.data.type === "card") {
						table_Data.query = success.data.result.fulfillment.data.data
						flag = true;
						if (success.data.result.fulfillment.data.table == "up") table_pos = true
					}

					if (flag && table_pos) {
						sp.push(table_Data)
					}

					/**UP Arrow */
					var trial = [];

					success.data.result.fulfillment.data.DownButton.GenerativeQuestion.map(
						(m, i) => {
							// console.log(i);

							console.log("isClicked: inside Generative Question array");
							if (trial.length < 10) trial.push(m);
						}
					);
					set_jcb_down_button_data([].concat(trial));
					/** */

					success.data.result.fulfillment.messages.map((m) => {
						// console.log("type: " + m.type + " speec: " + m.speech);

						console.log("isClicked: inside messages array");
						if (m.type === 0 && m.speech !== "") {
							m.speech.map((mm, qq) => {
								var inital_message = {
									session: getSessionId(),
									query: mm,
									type: "receive",
									time: startTime(),
									count: value.length,
									conversationId: conversation_id
								};
								sp.push(inital_message);
							});
						} else if (m.type === 2 || m.type === 5) {
							m.replies.map((mm) => {
								var inital_message = {
									session: getSessionId(),
									query: mm,
									newTabUrl: m.type === 5 ? m.urls[0] : null,
									type: "button",
									time: startTime(),
									count: value.length,
									conversationId: conversation_id
								};
								// console.log("replies: " + mm);
								btn.push(inital_message);
							});
						} else if (m.type === 3) {
							var inital_message = {
								session: getSessionId(),
								query: m.speech,
								type: "image",
								time: startTime(),
								count: value.length,
								conversationId: conversation_id
							};
							console.log("ImageLink: " + inital_message.query);
							sp.push(inital_message);
						} else if (m.type === 4 && m.speech !== "") {
							var inital_message = {
								session: getSessionId(),
								query: m.speech,
								type: "receive",
								time: startTime(),
								count: value.length,
								conversationId: conversation_id
							};
							actionText.push(inital_message);
						}
					});
					// console.log(btn);
					// console.log(sp);
					if (flag && !table_pos) {
						sp.push(table_Data)
					}

					setValue([...value, payload].concat(sp).concat(actionText));

					setButtonValue([].concat(btn));
					setLoader(-1);
				})
				.catch((error) => {
					console.log(
						"isClicked: catch of abcl.vitt.ai fetching api and error is: " +
						error
					);
					/**If we get 500 Internal error. then we will show this query. */
					var errors = "";
					// console.log(error.message)
					if (error.message.includes("Network")) errors = "There's a technical issue. Please check back in some time."
					else errors = "Oops! please Enter something related to Finance!"
					var inital_message = {
						session: getSessionId(),
						query: errors,
						type: "receive",
						time: startTime(),
						count: value.length,
						conversationId: conversation_id
					};
					setValue([...value, payload, inital_message]);
					setLoader(-1);
					// console.log(error);
				});

			//console.log(value);
		}
		//console.log(value);
		count++;
		document.getElementById("jcb_my_form").reset();
	}


	function tableHyperLinkClick(m) {
		payload = {
			session: getSessionId(),
			query: m,
			type: "sent",
			time: startTime(),
			count: value.length,
			conversationId: conversation_id,
			pageUrl: window.location.href
		};
		isClicked();
	}


	/**Bottom sheet logic */

	const bottomsheetonClick = () => {
		var obj = sheet.bottomSheet
			? { bottomSheet: false }
			: { bottomSheet: true };
		setBottomSheet(obj);
		setEscapeButton(!escapeButton)
	};
	var downbuttons = jcb_down_button_data.map((m, i) => {
		return (
			<button
				key={i *313}
				className="jcb_bottom-sheet-item"
				onClick={() => {
					onclick(m);
					bottomsheetonClick();
				}}
			>
				{m}
			</button>
		);
	});


	/*Scroll to Bottom Easy UI*/
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [value, buttonValue]);


	function onMaximizeChatBot() {
		if (maximizeChatBot === "") {
			setMaximizeChatBot("jcb_maximize-icon-heading-chatbot-Main");
			setMaxOrMinIcon("/images/minimize.png")
		}
		else {
			setMaximizeChatBot("");
			setMaxOrMinIcon("/images/maximize.png");
		}
	}


	/**Return Type */
	return (
		<div className={"jcb " + maximizeChatBot} >
			<div className="jcb_blackScreenShadow_chatBot"></div>
			<div
				className="jcb_chat-window jcb_chatbotAnimationclassNameFadeIn"
				id="jcb_chatBot-id"
				style={{ display: props.active ? "block" : "none" }}
			>
				<div className="jcb_panel-default">
					<div className="jcb_panel-logo-wrapper">
						<div style={{ textAlign: "right" }} className="jcb_action-btn">
							<img alt="maximize_icon" className="jcb_maximize-icon-heading-chatbot" onClick={(m) => { m.preventDefault(); onMaximizeChatBot(); }} src={maxOrMinIcon} />
							<img alt="close_icon" style={{ cursor: "pointer" }} className="close-icon-heading-chatbot" onClick={(m) => {
								m.preventDefault();
								setMaximizeChatBot(""); props.closeChatbot(); setBottomSheet({ bottomSheet: false })
							}} src="/images/remove.png" />
						</div>
						<div className="jcb_panel-logo">
							<div className="jcb_logo-text">Wealth Assist</div>
							<div className="jcb_logo-image">
								<img src="https://c3india.s3.ap-south-1.amazonaws.com/public_assets/data/000/000/344/original/BirlaCapitalLogo_jpeg?1538291690" />
							</div>
						</div>
					</div>
					<div className="jcb_panel-heading-text">
						Aditya Birla Finance Limited (AMFI registered Mutual Fund Distributor)
					</div>
					<div className="panel-body jcb_msg_container_base">

						{receives}
						
						{loader !== -1 ? <div className="jcb_loader_animation_chatbot"><Dot>.</Dot><Dot>.</Dot><Dot>.</Dot> </div> : null}
						{recievesButton.length !== 0 ? <div className="row jcb_msg_container ">
							<div className="jcb_btn_messs">{recievesButton}</div>
						</div> : null}
						<div ref={messagesEndRef} />

					</div>
					{/**Bottom sheet implementation */}
					<ReactBottomsheet
						className="jcb_custom-layout"
						visible={sheet.bottomSheet}
						onClose={bottomsheetonClick}
						appendCancelBtn={false}
					>
						<div>{downbuttons}</div>
					</ReactBottomsheet>
					<div className="jcb_panel-footer">
						<div className="jcb_input-group">
							<form
								autoComplete="off"
								id="jcb_my_form"
								onSubmit={(m) => {
									m.preventDefault();
									isClicked(true);
								}}
							>
								<DownButton onClick={bottomsheetonClick} visible={sheet.bottomSheet} />
								<Input
									change={submitForm}
									textBoolean={textAreaInput}
									onEnterPress={(e) => { onclick(payload.query) }}
									EscapeButton={escapeButton}
								/>
								<Button
									click={() => {
										clickButton();
										isClicked(true);
									}}
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ChatWindow;
