// Mobion StealthGuard™ Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive 3D Phone Rotation & Privacy Angle Simulator
  const angleSlider = document.getElementById('angleSlider');
  const phoneMockup = document.getElementById('phoneMockup');
  const simOverlay = document.getElementById('simOverlay');
  const simAngleText = document.getElementById('simAngleText');
  const statusBadge = document.getElementById('statusBadge');

  if (angleSlider && phoneMockup && simOverlay && simAngleText && statusBadge) {
    angleSlider.addEventListener('input', (e) => {
      const angle = parseInt(e.target.value, 10);
      simAngleText.textContent = `${angle}°`;
      
      // Physically rotate the phone mockup in 3D space
      phoneMockup.style.transform = `rotateY(${angle * 1.25}deg) rotateX(${angle * 0.15}deg)`;

      // Calculate opacity: 0 opacity at 0°, 100% opacity at 28°+
      let opacity = 0;
      if (angle >= 5) {
        opacity = Math.min(1, (angle - 5) / 23);
      }
      simOverlay.style.opacity = opacity;

      // Dynamic badge updates
      if (angle >= 28) {
        statusBadge.textContent = '🔒 Tela 100% Oculta e Privada (Ângulo 28°)';
        statusBadge.style.borderColor = '#00f2fe';
        statusBadge.style.color = '#00f2fe';
      } else if (angle > 10) {
        statusBadge.textContent = '🛡️ Proteção de Privacidade Ativando...';
        statusBadge.style.borderColor = '#38bdf8';
        statusBadge.style.color = '#38bdf8';
      } else {
        statusBadge.textContent = '👁️ Visão Frontal Direta (100% HD Clear)';
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
        timerElement.textContent = '00:00 - OFERTA PRORROGADA';
      } else {
        timeRemaining--;
      }
    }, 1000);
  }

  // 3. FAQ Accordion Logic
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
