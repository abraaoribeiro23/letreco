import { useEffect, useState } from "react";
import { BsShare } from "react-icons/bs";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GuessLetter, KeyboardButtonStates } from "../models";
import { getLast, getToday, wordList } from "../utils";
import { getPathWordEncrypted } from "../utils/pathword.util";
import { KEY_BACKSPACE, KEY_ENTER, KEY_LETTERS, SAVED_GAME_INIT } from "./Game";
import GuessCreate from "./GuessCreate";
import Keyboard from "./Keyboard";

export const CREATE_WORD_SIZE = 5;
export const CREATE_GUESS_LIST_SIZE = 1;
const SAVED_GAME_CREATE_KEY = "savedGameCreate";
//const DOMAIN = "http://localhost:3000/";
const DOMAIN = "https://letreco-share-demo.herokuapp.com/";

const BUTTON_STATES_INIT: KeyboardButtonStates = {
  letters: true,
  back: false,
  enter: false,
};

const updateKeyboardButtonStates = (
  guesses: GuessLetter[][]
): KeyboardButtonStates => {
  const lastGuess = getLast(guesses || [[]]);

  return {
    letters: lastGuess.length < CREATE_WORD_SIZE,
    back: lastGuess.length > 0,
    enter: lastGuess.length === CREATE_WORD_SIZE,
  };
};

function CreateGame() {
  const [link, setLink] = useState("");

  const [{ date: savedDate, guesses, winState, letterStates }, setSavedGame] =
    useLocalStorage(SAVED_GAME_CREATE_KEY, SAVED_GAME_INIT);

  const [buttonStates, setButtonStates] = useState<KeyboardButtonStates>(
    updateKeyboardButtonStates(guesses)
  );

  if (savedDate !== getToday()) {
    setButtonStates(BUTTON_STATES_INIT);
    setSavedGame(SAVED_GAME_INIT);
  }

  const updateLastGuess = (newGuess: GuessLetter[]): GuessLetter[][] => {
    return [...guesses.slice(0, guesses.length - 1), newGuess];
  };

  const handleKeyboardLetter = (letter: string) => {
    if (winState.isGameEnded) return;

    const updatedGuesses = updateLastGuess([
      ...getLast(guesses),
      { letter, state: "typing" },
    ]);

    setSavedGame({ guesses: updatedGuesses });
    setButtonStates(updateKeyboardButtonStates(updatedGuesses));
  };

  const handleKeyboardBack = () => {
    if (winState.isGameEnded) return;

    const lastGuess = getLast(guesses);
    const newGuess: GuessLetter[] = lastGuess
      .slice(0, lastGuess.length - 1)
      .map(
        (oldGuess) =>
          ({ letter: oldGuess.letter, state: "typing" } as GuessLetter)
      );

    const updatedGuesses = updateLastGuess(newGuess);

    setSavedGame({ guesses: updatedGuesses });
    setButtonStates(updateKeyboardButtonStates(updatedGuesses));
  };

  const handleKeyboardEnter = () => {
    if (!isLastGuessInWordList()) {
      const newGuess = getLast(guesses)
        .map(guess => ({ letter: guess.letter, state: 'wordlistError' }) as GuessLetter);

      const updatedGuesses = updateLastGuess(newGuess);

      setSavedGame({ guesses: updatedGuesses });
      setButtonStates(updateKeyboardButtonStates(updatedGuesses));

      return;
    }

    var word = guesses[0].map((x) => x.letter).join("");
    setLink(DOMAIN + "open?code=" + getPathWordEncrypted(word));
  };
  const shareLink = () => {
    navigator.share({ text: link });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEY_BACKSPACE && buttonStates.back) {
      handleKeyboardBack();
      return;
    }

    if (event.key === KEY_ENTER && buttonStates.enter) {
      handleKeyboardEnter();
      return;
    }

    if (KEY_LETTERS.includes(event.key) && buttonStates.letters) {
      handleKeyboardLetter(event.key.toUpperCase());
    }
  };
  const isLastGuessInWordList = (): boolean => {
    const lastGuessWord = getLast(guesses)
      .map(guess => guess.letter)
      .join('');

    return wordList.includes(lastGuessWord);
  }
  
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="mt-3">
      <h3 className="d-flex justify-content-center mb-3">Criar Desafio</h3>
      <div className="mb-4">
        <GuessCreate guesses={guesses} />
      </div>
      <div className="d-flex justify-content-center mb-4">
        <input className="rounded me-2" type="text" value={link} readOnly />
        <button
          className="header-button rounded d-flex align-items-center justify-content-center py-2"
          onClick={() => shareLink()}
        >
          <BsShare/>
        </button>
      </div>
      <Keyboard
        onLetterPress={handleKeyboardLetter}
        onBackPress={handleKeyboardBack}
        onEnterPress={handleKeyboardEnter}
        buttonStates={buttonStates}
        letterStates={letterStates}
        enabled={!winState.isGameEnded}
      />
    </div>
  );
}

export default CreateGame;
