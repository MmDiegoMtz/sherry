document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlideIndex = 0;
  
    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.style.display = 'block';
        } else {
          slide.style.display = 'none';
        }
      });
    }
  
    showSlide(currentSlideIndex);
  
    function goToSlide(index) {
      if (index >= 0 && index < slides.length) {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
      }
    }
  
    // Event listeners for navigation
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
  
    nextButton.addEventListener('click', function() {
      goToSlide(currentSlideIndex + 1);
    });
  
    prevButton.addEventListener('click', function() {
      goToSlide(currentSlideIndex - 1);
    });
  });