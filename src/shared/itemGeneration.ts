import { useAuth } from "../contexts/AuthContext";
import { mapApiToBaseObject } from "../contexts/ObjectsContext";
import apiClient from "./api";

const { user } = useAuth();
const questionIndex = user.questionIndex;
const QUESTIONS = [
	"지금 가장 생각나는 사람이 누구인가요? 그 사람과의 기억을 떠올려볼까요?",
	"어릴 때부터 애착을 가지고 있던 물건이 있나요?",
	"삶에서 나를 지탱해준 공간이 있다면 어디일까요? 집, 학교, 카페, 놀이터 등 .. 어떤 것이든 좋아요!",
	"세상을 떠난 뒤, 당신을 찾아온 이들에게 들려주고 싶은 노래가 있나요?",
	"지금 가장 듣고 싶은 말이 무엇인가요?",
	"좋아하는 향이 있나요?",
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
	return generatedObject;
};
