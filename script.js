/*
=========================================================
CYBERWIZARDS - SCRIPT PRINCIPAL
Este arquivo controla:
1. partículas flutuantes de fundo
2. animações de entrada ao rolar a página
3. comportamento do formulário em modo demonstração
4. pontos prontos para integrar GA4 e Meta Pixel no futuro
=========================================================
*/

/* 1) PARTÍCULAS FLUTUANTES */
const particlesContainer = document.getElementById("floatingParticles");

/* Função para gerar partículas aleatórias. */
function createParticles(amount = 18) {
  if (!particlesContainer) return;

  const colors = ["#51ff9c", "#a66cff", "#7dffcf"];

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");

    const size = Math.random() * 8 + 4; // entre 4px e 12px
    const left = Math.random() * 100;   // posição horizontal em %
    const duration = Math.random() * 12 + 10; // entre 10s e 22s
    const delay = Math.random() * 8;
    const opacity = Math.random() * 0.5 + 0.25;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = `-10vh`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = opacity;
    particle.style.color = color;
    particle.style.background = color;

    particlesContainer.appendChild(particle);
  }
}

createParticles();

/* 2) ANIMAÇÃO DE ENTRADA AO ROLAR */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* 3) SCROLL SUAVE EXTRA PARA LINKS INTERNOS */
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

/* 4) FORMULÁRIO */
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const interest = document.getElementById("interest");
    const message = document.getElementById("message");

    if (!name.value.trim() || !email.value.trim() || !interest.value.trim() || !message.value.trim()) {
      formFeedback.textContent = "Preencha todos os campos para continuar.";
      formFeedback.style.color = "#ff9f9f";
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

    if (!emailIsValid) {
      formFeedback.textContent = "Digite um email válido.";
      formFeedback.style.color = "#ff9f9f";
      return;
    }

    const formData = new FormData(contactForm);

    formData.append("access_key", "23410455-e8de-4b2f-b3dd-605fca9f1d43");

    formFeedback.textContent = "Enviando...";
    formFeedback.style.color = "#b9c0d0";

    try {

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        formFeedback.textContent = "Mensagem enviada com sucesso!";
        formFeedback.style.color = "#51ff9c";

        contactForm.reset();

        setTimeout(() => {
          window.location.href = "obrigado.html";
        }, 1500);



      } else {
        formFeedback.textContent = "Erro ao enviar. Tente novamente.";
        formFeedback.style.color = "#ff9f9f";
      }

    } catch (error) {
      formFeedback.textContent = "Erro de conexão.";
      formFeedback.style.color = "#ff9f9f";
    }
  });
}

/* 5) CAPTURA DE CLICKS EM CTAs */
const heroPrimaryCta = document.getElementById("heroPrimaryCta");
const finalCta = document.getElementById("finalCta");

function handleCtaTracking(ctaName) {
  console.log(`CTA clicado: ${ctaName}`);
}

if (heroPrimaryCta) {
  heroPrimaryCta.addEventListener("click", () => {
    handleCtaTracking("hero_primary");
  });
}

if (finalCta) {
  finalCta.addEventListener("click", () => {
    handleCtaTracking("final_cta");
  });
}