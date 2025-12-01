// shared/itemGeneration.ts
import { mapApiToBaseObject } from "../contexts/ObjectsContext";
import apiClient from "./api";

const QUESTIONS = [
	"지금 가장 생각나는 사람이 누구인가요? 그 사람과의 기억을 떠올려볼까요?",
	"어릴 때부터 애착을 가지고 있던 물건이 있나요?",
	"삶에서 나를 지탱해준 공간이 있다면 어디일까요? 집, 학교, 카페, 놀이터 등 .. 어떤 것이든 좋아요!",
	"세상을 떠난 뒤, 당신을 찾아온 이들에게 들려주고 싶은 노래가 있나요?",
	"지금 가장 듣고 싶은 말이 무엇인가요?",
	"좋아하는 향이 있나요?",
];

/**
 * 주어진 questionIndex에 해당하는 질문을 돌려줍니다.
 * index 범위를 벗어나면 0번째 질문을 사용합니다.
 */
const getQuestionByIndex = (questionIndex: number): string => {
	if (questionIndex < 0 || questionIndex >= QUESTIONS.length) {
		return QUESTIONS[0];
	}
	return QUESTIONS[questionIndex];
};

/**
 * 1차 답변(answer1)과 질문 인덱스를 받아
 * 백엔드에서 2차 질문을 받아오는 함수
 */
export const getSecondQ = async (answer1: string, questionIndex: number) => {
	const question1 = getQuestionByIndex(questionIndex);
	const query = `Q1:${question1}, A1:${answer1}`;

	const response = await apiClient.post("/second-question", {
		content: query,
	});

	return response.data;
};

/**
 * 1차/2차 질문 & 답변을 모두 이용해
 * 백엔드에서 객체를 생성하고, mapApiToBaseObject로 변환해서 돌려줍니다.
 */
export const answerSecondQ = async (
	answer1: string,
	question1: string,
	question2: string,
	answer2: string,
) => {
	const query = `Q1:${question1}, A1:${answer1} / Q2:${question2}, A2:${answer2}`;
	const response = await apiClient.post("/object", {
		content: query,
	});

	const generatedObject = mapApiToBaseObject(response.data);
	return generatedObject;
};
