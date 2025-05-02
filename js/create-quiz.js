// create-quiz.js — handles showing one question slide at a time when building the quiz
// waits until the page finishes loading before running any code

// Wait until DOM fully parsed
document.addEventListener('DOMContentLoaded', () => {
  // find all question slides and the Prev/Next buttons
  const slides = document.querySelectorAll('.question-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  // if any of these elements is missing, stop running (no errors)
  if (!slides.length || !prevBtn || !nextBtn) return;

  let current = 0; // track which slide number we’re on (0-based index)

  // function to show only the active slide and update button states
  const updateSlides = () => {
    // loop through slides, add/remove 'active' class
    slides.forEach((sl, i) => sl.classList.toggle('active', i === current));
    // disable Prev button on the first slide since there’s nowhere to go back
    prevBtn.disabled = current === 0;
    if (current === slides.length - 1) {
      // if this is the last slide, change Next button to a submit action
      nextBtn.textContent = 'Save & Continue';
      nextBtn.type = 'submit';
    } else {
      // otherwise keep it as a normal Next button
      nextBtn.textContent = 'Next';
      nextBtn.type = 'button';
    }
  };

  // move to the previous slide when Prev is clicked
  prevBtn.addEventListener('click', () => {
    if (current > 0) current--; // only go back if not on the first slide
    updateSlides();
  });
  // move to the next slide when Next is clicked
  nextBtn.addEventListener('click', () => {
    if (current < slides.length - 1) current++; // only advance if not on last slide
    updateSlides();
  });

  // initialize display on first load
  updateSlides();
});

// when the quiz-form is submitted, gather all questions and save them
document.getElementById('quiz-form').onsubmit = function(e) {
  e.preventDefault(); // stop the page from reloading on submit
  const questions = []; // array to hold all question objects

  // loop through questions 1 to 10 (as IDs are numbered question1…question10)
  for (let i = 1; i <= 10; i++) {
    // get the text the user typed in for the question
    const qText = document.getElementById(`question${i}`)?.value;
    // find which radio button is checked for the correct answer
    const checked = document.querySelector(`input[name="correct${i}"]:checked`);
    const correctIndex = checked ? parseInt(checked.value) : null;
    const opts = []; // will hold each option’s text and a flag for correct/incorrect

    // gather each of the 4 options for this question
    for (let j = 1; j <= 4; j++) {
      const optEl = document.getElementById(`option${i}_${j}`);
      if (optEl) {
        opts.push({
          text: optEl.value,          // the text of this option
          isCorrect: j === correctIndex // true if this option was marked correct
        });
      }
    }

    // only add this question if it has text, four options, and a chosen correct answer
    if (qText && opts.length === 4 && correctIndex != null) {
      questions.push({ question: qText, options: opts });
    }
  }

  // save our collected questions into the shared quizData object
  quizData.questions = questions;
  // store quizData in the browser so other pages can read it
  localStorage.setItem('quizData', JSON.stringify(quizData));
  // redirect the user to the play-quiz page to start answering
  window.location.href = 'play-quiz.html';
};
