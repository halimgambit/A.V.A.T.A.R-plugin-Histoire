import {default as _helpers} from '../../ia/node_modules/ava-ia/helpers/index.js'

export default function (state) {
	return new Promise((resolve) => {
		
	try {

  const sentence = state.rawSentence;

      let stopStory = false;

      const terms = sentence.toLowerCase().split(" ");

      const stopWords = ["éteins", "coupe", "stop", "stoppe", "arrête"];

      stopStory = terms.some(t => stopWords.includes(t));

  setTimeout(() => { 
   if (stopStory) {
     state.action = {
      module: 'Histoire',
      command: 'stopStory',
     };
     } else {
     if (state.debug) info('Action Histoire');
   state.action = {
    module: 'Histoire',
    command: state.rule,
   };
  };
   resolve(state);
  }, Config.waitAction.time);

  } catch (error) {
   reject(new Error(`Une erreur s'est produite lors du traitement de la commande Histoire: ${error.message}`));
  }

 });
}