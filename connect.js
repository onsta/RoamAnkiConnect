const roamData = require("./roamData.json");
const axios = require("axios");

const TAG = "#Flashcard";
const API = "http://localhost:8765/";
const DECK = "Default";

const findAllFlashcards = (nodes, flashcards) =>
  nodes.reduce((flashcards, node) => {
    if (node.string && node.string.includes(TAG)) {
      flashcards.push(node);
    }

    if (node.children) {
      flashcards = findAllFlashcards(node.children, flashcards);
    }

    return flashcards;
  }, flashcards);

const flashcards = findAllFlashcards(roamData, []);

flashcards.forEach((flashcard) => {
  axios({
    method: "post",
    url: API,
    data: {
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName: DECK,
          modelName: "Basic",
          fields: {
            Front: flashcard.string.replace(TAG, ""),
            Back: flashcard.children.map((child) => child.string).join("\n"),
          },
          options: {
            allowDuplicate: false,
            duplicateScope: "deck",
          },
          tags: ["roamResearch"],
        },
      },
    },
  });
});
