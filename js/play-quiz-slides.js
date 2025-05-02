// play-quiz-slides.js — builds and navigates the quiz-taking slides
// waits until the page is ready before running

document.addEventListener('DOMContentLoaded', () => {
  // load the saved quiz data or start with an empty object
  const storedData = JSON.parse(localStorage.getItem('quizData')) || {};
  // extract questions array (or empty if none)
  const questions = storedData.questions || [];
  // find the container where slides should be shown
  const container = document.getElementById('slides-container');

  // for each question, create a slide element
  questions.forEach((q, i) => {
    const slide = document.createElement('div');
    slide.classList.add('question-slide');
    // mark the first slide as active so it shows on load
    if (i === 0) slide.classList.add('active');

    // start building inner HTML with the question text
    let html = `<p>${q.question}</p>`;
    // add each option as a radio input inside a label
    q.options.forEach((opt, j) => {
      html += `
        <div>
          <label>
            <input type="radio" name="q${i}" value="${j}">
            ${opt.text}
          </label>
        </div>`;
    });
    // set the slide’s content and add it to the page
    slide.innerHTML = html;
    container.appendChild(slide);
  });

  // after building slides, grab them and the nav buttons
  const slides = document.querySelectorAll('.question-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let current = 0; // track which slide index is currently visible

  // function to update which slide is shown and button labels
  const updateSlides = () => {
    slides.forEach((sl, idx) => {
      // add 'active' to the current slide, remove from others
      sl.classList.toggle('active', idx === current);
    });
    // hide Prev button on the first slide
    prevBtn.style.visibility = current > 0 ? 'visible' : 'hidden';
    // change the Next button text to 'Submit' on the last slide
    nextBtn.textContent =
      current === slides.length - 1 ? 'Submit' : 'Next';
  };

  // initialize slide visibility on load
  updateSlides();

  // go back one slide if Prev clicked and not on the first
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateSlides();
    }
  });

  // go forward one slide or submit answers on last slide
  nextBtn.addEventListener('click', () => {
    if (current < slides.length - 1) {
      // move to next slide
      current++;
      updateSlides();
    } else {
      // on last slide: collect answers from all radios
      storedData.userAnswers = questions.map((_, i) => {
        const sel = document.querySelector(
          `input[name="q${i}"]:checked`
        );
        // return the selected index or null if none chosen
        return sel ? parseInt(sel.value) : null;
      });
      // save the answers back to localStorage
      localStorage.setItem('quizData', JSON.stringify(storedData));
      // move to the answer-review page
      window.location.href = 'answer.html';
    }
  });
});
