import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function init () {
    await Avatar.lang.addPluginPak('Histoire');
}

export async function action(data, callback) {

    const client = data.client;
    const toClient = data.toClient || client;

    try {

        const L = await Avatar.lang.getPak('Histoire', data.language);

       const tblActions = {
            playStory: () => playStory(data, client, toClient, L, callback),
            stopStory: () => stopStory(client, toClient, L, callback)
        };

      info("Histoire:", data.action.command, "from", data.client, "to", data.toClient);

       if (tblActions[data.action.command]) {
                await tblActions[data.action.command]();
            } else {
                callback();
            }

	} catch (err) {
		if (data.client) Avatar.Speech.end(data.client);
		error(err.stack || err.message || err);
		callback();
	}
}


const playStory = (data, client, toClient, L, callback) => {

	 const sentence = (data.rawSentence || "").toLowerCase();
    const stories = Config.modules.Histoire.stories;

    const nameStory = Object.keys(stories).sort((a, b) => b.length - a.length).find(key =>
        sentence.includes(key.toLowerCase())
    );

	if (!nameStory) {
    Avatar.speak(L.get("speech.noStory"), client, () => {
        callback();
    });
    return;
}

    const storyUrl  = stories[nameStory];

    const announce = L.get(["speech.speakStory", nameStory]);
    const playUrl = L.get(["speech.playStory", storyUrl]);

    info(announce);
    info("Lecture de :", playUrl);

    Avatar.stop(toClient, () => {
    Avatar.speak(announce, client, () => {
        Avatar.play(playUrl, toClient, 'url', 'before');
        callback();
    });
  });
}


const stopStory = (client, toClient, L, callback) => {

	Avatar.stop(toClient, () => {
	Avatar.speak(L.get("speech.stopStory"), client, () => {
        callback();
    });
  });

}
