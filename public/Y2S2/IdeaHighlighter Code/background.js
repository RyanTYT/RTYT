// const SummaryBot = require('summarybot')
// import { summaryBot } from "./summarybot/summaryBot.js";
import SummaryBot from "./summarybot/summaryBot.js";
const summarizer = new SummaryBot();

const WORD_COUNT_THRESHOLD = 3;
const CHAR_COUNT_MIN_THRESHOLD = 15; // min number of characters
const LINK_DENSITY_THRESHOLD = 0.75;
// max number of words to be considered a candidate
const CHAR_COUNT_MAX_THRESHOLD = 1000;
const AVG_WORD_LEN_THRESHOLD = 15;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request.sentences);
	const sentences = summarizer
		.run(request.sentences.join("."), request.sentences.length / 20, false)
		.split(".")
		.map((sentence) => sentence + ".")
		.filter((sentence) => sentence.length > CHAR_COUNT_MIN_THRESHOLD);
	console.log(sentences);
	sendResponse({
		response: {
			sentences: sentences,
		},
	});
});
