// quiz.js — shared data model across all quiz pages
// This object holds everything we need to keep track of across screens:
// - username: the name the player enters at the start
// - questions: the list of questions you create (each with its own options)
// - userAnswers: which option index the player chose for each question
// - score: total correct answers after they finish the quiz

const quizData = {
  username: '',    // will store the player's name entered on the main page
  questions: [],   // array of question objects: { question: '', options: [ { text, isCorrect }, ... ] }
  userAnswers: [], // array of numbers indicating which option the user picked per question
  score: 0         // will be calculated once the quiz is submitted
};
