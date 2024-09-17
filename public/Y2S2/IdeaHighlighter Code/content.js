// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
const WORD_COUNT_THRESHOLD = 3;
const CHAR_COUNT_MIN_THRESHOLD = 15; // min number of characters
const LINK_DENSITY_THRESHOLD = 0.75;
// max number of words to be considered a candidate
const CHAR_COUNT_MAX_THRESHOLD = 1000;
const AVG_WORD_LEN_THRESHOLD = 15;
const sentences = document.body.innerText
	.split(/\r?\n|\./)
	.filter(
		(sentence) =>
			sentence.split(" ").length > WORD_COUNT_THRESHOLD &&
			sentence.split("").length > CHAR_COUNT_MIN_THRESHOLD &&
			sentence.split("").length < CHAR_COUNT_MAX_THRESHOLD
	);

chrome.runtime.sendMessage(
	{
		from: "script1",
		sentences: sentences,
	},
	(resp) => {
		console.log("fuck");
		const topn = resp.response.sentences;
		console.log(topn);
		for (let i = 0; i < topn.length; i++) {
			document.body.innerHTML = document.body.innerHTML.replace(
				topn[i],
				`<span style="background-color: #FFFF00">` +
					topn[i] +
					`</span>`
			);
		}
	}
);

console.log("reached");
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.sentences) {
//         // Highlight
//         console.log("lol");
//     }
//     sendResponse({ response: "retarded" });
// });
