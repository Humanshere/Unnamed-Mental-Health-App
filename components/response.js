import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const date = new Date();
const API_KEY = "AIzaSyDT1s8aYX1lyyorvfHwsXDdCGFlbhequXw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Or 'gemini-pro-vision' for multimodal

let history=[
	{
        role: "user",
        parts: [{ text: "You are a supportive bot named Ravya. From the next prompt, Have a friendly conversation with me and answer with short mental health advices when required. Also at the end of your response you must rate my mood on a scale of 1 to 10, write the Mood: 'number'." }],
      },
      {
        role: "model",
        parts: [{ text: "Okay! I’m ready to chat. How are you doing today? I’m here to listen and offer some support if you need it. Just let me know what’s on your mind." }],
      },
];

export default function Response(props) {
	const [generatedText, setGeneratedText] = useState("");

	const sendMessage = async () => {
// 1. Add the user's message to the history
history.push({ role: 'user', parts: [{ text: props.prompt }] });
  
try {
  // 2. Send the entire history in the request
  const result = await model.generateContent({
	contents: history,
  });
  const response = await result.response;
  const text = response.candidates[0].content.parts[0].text;
  setGeneratedText(text);

  // 3. Add the model's response to the history
  history.push({ role: 'model', parts: [{ text }] });

  // 4. Display the model's response to the user
  console.log('Model:', text);

  // (Optional) You might want to limit the history size to avoid exceeding token limits
  // history = history.slice(-N); // Keep the last N messages
} catch (error) {
  console.error('Error generating content:', error);
}}
useEffect(() => {
	if (props.prompt) {
	  sendMessage();
	}
  }, [props.prompt]);
  
	return (
		<View style={styles.response}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("../assets//icons/robot.png")} style={styles.icon} />
					<Text style={{ fontWeight: 600 }}>Mental Health Bot</Text>
				</View>
				<Text style={{ fontSize: 10, fontWeight: "600" }}>
					{date.getHours()}:{date.getMinutes()}
				</Text>
			</View>
			<Markdown>{generatedText}</Markdown>
		</View>
	);
}

const styles = StyleSheet.create({
	response: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#fafafa",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 28,
		height: 28,
	},
});
