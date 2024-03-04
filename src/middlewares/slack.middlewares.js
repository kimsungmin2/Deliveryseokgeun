import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const slackBot = new WebClient(token);

export const sendTodayData = async () => {
    try {
        const message = "주문이 들어왔습니다. 확인해주세요.";
        await slackBot.chat.postMessage({
            channel: channel,
            text: message,
        });
    } catch (err) {
        console.log(err.message);
    }
};
