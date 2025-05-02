// answer-slides.js — builds slides to review your answers vs. correct answers
// waits for the HTML to finish loading before running anything

document.addEventListener('DOMContentLoaded', () => {
  // load saved quiz data from localStorage (or use empty object if none)
  const storedData = JSON.parse(localStorage.getItem('quizData')) || {};
  // get questions array (each has question text and options)
  const questions = storedData.questions || [];
  // get the answers the user selected earlier
  const userAnswers = storedData.userAnswers || [];
  // find the container where we will put our review slides
  const container = document.getElementById('slides-container');
  let score = 0; // will count how many answers are correct

  // create one review slide per question
  questions.forEach((q, i) => {
    // find the index of the answer the user chose for this question
    const userIdx = userAnswers[i];
    // find the option object that is the correct answer
    const correctOpt = q.options.find(opt => opt.isCorrect);
    // get the text user selected, or 'No answer' if they didn't pick one
    const userText = (userIdx !== null && q.options[userIdx])
      ? q.options[userIdx].text
      : 'No answer';

    // if the chosen option was correct, add one to score
    if (q.options[userIdx]?.isCorrect) score++;

    // build a slide element to show question, user answer, and correct answer
    const slide = document.createElement('div');
    slide.classList.add('question-slide');
    // mark the first slide active so it displays immediately
    if (i === 0) slide.classList.add('active');
    slide.innerHTML = `
      <h2>Question ${i + 1}</h2>
      <p>${q.question}</p>
      <p><strong>Your Answer:</strong> ${userText}</p>
      <p><strong>Correct Answer:</strong> ${correctOpt.text}</p>
    `;
    // add this slide to the page
    container.appendChild(slide);
  });

  // after all question slides, add one final slide to show the score
  const finalSlide = document.createElement('div');
  finalSlide.classList.add('question-slide');
  finalSlide.innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p><a href="score.html">View Score Details</a></p>
  `;
  container.appendChild(finalSlide);

  // update storedData with new score and save it back to localStorage
  storedData.score = score;
  localStorage.setItem('quizData', JSON.stringify(storedData));

  // now set up navigation for these review slides, same as play-quiz
  const slides = document.querySelectorAll('.question-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let current = 0; // track which slide is active

  // function to show only the current slide and update button texts
  const updateSlides = () => {
    slides.forEach((sl, idx) => sl.classList.toggle('active', idx === current));
    // hide Prev button on the first slide
    prevBtn.style.visibility = current > 0 ? 'visible' : 'hidden';
    // change Next button to 'Finish' on the last review slide
    nextBtn.textContent = current === slides.length - 1 ? 'Finish' : 'Next';
  };
  updateSlides(); // show first slide initially

  // Prev button: go back one slide if possible
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateSlides();
    }
  });
  // Next button: go forward or finish (redirect to score page)
  nextBtn.addEventListener('click', () => {
    if (current < slides.length - 1) {
      current++;
      updateSlides();
    } else {
      // on the last slide, take user to detailed rating page
      window.location.href = 'score.html';
    }
  });
});