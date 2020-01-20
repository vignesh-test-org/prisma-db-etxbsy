export const processGreetings = function(from, message, intentResult) {
    console.log('Received::', from, message, intentResult);

    return {
        err: null,
        response: {
            message: `Hi there 👋 Nice to meet you. I am Hodor, The Timekeeper.
I keep track of all the things you do with your time, help you manage your goals and optimize the time wherever I can ⏳

Some examples:

1. Say "I was browsing from 7 PM to 9 PM today" or things like that in free-text and I will record the event for you.

2. Say "#feedback It would be great to have Chrome Extension support soon" and I will record your feedback (Make sure that you include the hashtag #feedback)

3. Say "#support I am unable to login to my account from yesterday" and I will record your support request (Make sure that you include the hashtag #support)

4. Saying "help" will bring up these tips again for you anytime.

I am learning by the day and will be able to do more soon.
            `
        }
    };
};
