// Mobion StealthGuard™ Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive 28-Degree Privacy Angle Simulator
  const angleSlider = document.getElementById('angleSlider');
  const simOverlay = document.getElementById('simOverlay');
  const simAngleText = document.getElementById('simAngleText');
  const statusBadge = document.getElementById('statusBadge');

  if (angleSlider && simOverlay && simAngleText && statusBadge) {
    angleSlider.addEventListener('input', (e) => {
      const angle = parseInt(e.target.value, 10);
      simAngleText.textContent = `${angle}°`;
      
      // Calculate opacity: 0 opacity at 0°, 100% opacity at 28°+
      let opacity = 0;
      if (angle >= 5) {
        opacity = Math.min(1, (angle - 5) / 23);
      }
      simOverlay.style.opacity = opacity;

      if (angle >= 28) {
        statusBadge.textContent = '🔒 Screen Completely Black & Secret (100% Private)';
        statusBadge.style.borderColor = '#00f2fe';
        statusBadge.style.color = '#00f2fe';
      } else if (angle > 10) {
        statusBadge.textContent = '🛡️ Privacy Protection Active';
        statusBadge.style.borderColor = '#38bdf8';
        statusBadge.style.color = '#38bdf8';
      } else {
        statusBadge.textContent = '👁️ Direct Front View (100% Ultra HD Clear)';
        statusBadge.style.borderColor = '#22c55e';
        statusBadge.style.color = '#22c55e';
      }
    });
  }

  // 2. Countdown Timer (14m 59s)
  let timeRemaining = 14 * 60 + 59;
  const timerElement = document.getElementById('countdownTimer');

  if (timerElement) {
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSecs = seconds < 10 ? `0${seconds}` : seconds;

      timerElement.textContent = `${formattedMins}:${formattedSecs}`;

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerElement.textContent = '00:00 - OFFER EXTENDED';
      } else {
        timeRemaining--;
      }
    }, 1000);
  }

  // 3. Bundle Selection Card Logic
  const bundleCards = document.querySelectorAll('.bundle-card');
  const orderPriceDisplay = document.getElementById('orderPriceDisplay');

  bundleCards.forEach((card) => {
    card.addEventListener('click', () => {
      bundleCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const price = card.getAttribute('data-price');
      if (orderPriceDisplay && price) {
        orderPriceDisplay.textContent = `£${price}`;
      }
    });
  });

  // 4. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
