import { useAuth } from "../contexts/AuthContext";
import { mapApiToBaseObject } from "../contexts/ObjectsContext";
import apiClient from "./api";

const { user } = useAuth();
const questionIndex = user.questionIndex;
const QUESTIONS = [
	"어떤 칭찬을 들으면 기분이 좋던가요?",
	"평소에 무엇을 기대하며 살고 있나요?",
	"주변 사람들에게 어떻게 기억되고 싶은가요?",
	"나의 삶을 한 문장으로 정리하자면?",
	"당신의 장례식은 분위기가 어땠으면 하나요?",
];
const currentQuestion = QUESTIONS[questionIndex];

export const getSecondQ = async (answer: string) => {
	const query = `Q : ${currentQuestion}, A: ${answer}`;
	const response = await apiClient.post("/object/followup", {
		content: query,
	});
	return response.data;
};

export const answerSecondQ = async (
	answer1: string,
	question2: string,
	answer2: string,
) => {
	const query = `Q1:${currentQuestion}, A1:${answer1} / Q2:${question2}, A2: ${answer2}`;
	const response = await apiClient.post("/object", {
		content: query,
	});
	const generatedObject = mapApiToBaseObject(response.data);
};
