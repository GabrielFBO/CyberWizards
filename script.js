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

/* ------------------------------------------------------
   1) PARTÍCULAS FLUTUANTES
   Criamos pequenos elementos visuais via JavaScript para
   dar clima de magia/cibernética sem poluir o HTML.
------------------------------------------------------ */
const particlesContainer = document.getElementById("floatingParticles");

/*
  Função para gerar partículas aleatórias.
  Cada uma recebe:
  - posição horizontal aleatória
  - tamanho aleatório
  - duração diferente
  - cor entre verde e roxo
*/
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

/* ------------------------------------------------------
   2) ANIMAÇÃO DE ENTRADA AO ROLAR
   Usamos IntersectionObserver para revelar elementos
   quando eles entram na área visível da tela.
------------------------------------------------------ */
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

/* ------------------------------------------------------
   3) SCROLL SUAVE EXTRA PARA LINKS INTERNOS
   O CSS já faz scroll-behavior: smooth, mas aqui mostramos
   como controlar isso via JS caso você queira expandir.
------------------------------------------------------ */
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

/* ------------------------------------------------------
   4) FORMULÁRIO - MODO DEMONSTRAÇÃO
   Neste momento ele:
   - valida campos básicos
   - mostra feedback visual
   - NÃO envia para servidor real ainda
   Depois vamos ligar isso a um endpoint real
   (Formspree, Web3Forms ou backend próprio).
------------------------------------------------------ */
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const interest = document.getElementById("interest");
    const message = document.getElementById("message");

    // Validação simples para garantir que os campos foram preenchidos
    if (!name.value.trim() || !email.value.trim() || !interest.value.trim() || !message.value.trim()) {
      formFeedback.textContent = "Preencha todos os campos para continuar.";
      formFeedback.style.color = "#ff9f9f";
      return;
    }

    // Validação simples de email
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

    if (!emailIsValid) {
      formFeedback.textContent = "Digite um email válido.";
      formFeedback.style.color = "#ff9f9f";
      return;
    }

    /*
      =========================================================
      AQUI COMEÇA A PARTE REAL (ENVIO DE FORMULÁRIO)
      =========================================================

      Em vez de só validar, agora vamos:
      - coletar os dados
      - enviar para um serviço externo (Web3Forms)
      - receber resposta (sucesso ou erro)
    */

    // Criamos um objeto com TODOS os dados do formulário automaticamente
    const formData = new FormData(contactForm);

    // Adicionamos a chave da API (obrigatório para o Web3Forms funcionar)
    formData.append("access_key", "23410455-e8de-4b2f-b3dd-605fca9f1d43");

    // Feedback visual enquanto envia
    formFeedback.textContent = "Enviando...";
    formFeedback.style.color = "#b9c0d0";

    try {
      /*
        fetch() = função que faz requisições HTTP (como um "pedido" para um servidor)

        Aqui estamos enviando:
        - método: POST (envio de dados)
        - body: os dados do formulário
      */
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      // Converte a resposta para JSON (formato que conseguimos usar no JS)
      const result = await response.json();

      // Se deu certo
      if (result.success) {
        formFeedback.textContent = "Mensagem enviada com sucesso!";
        formFeedback.style.color = "#51ff9c";

        // Limpa o formulário
        contactForm.reset();

        // Redireciona pra uma página de agradecimento
        setTimeout(() => {
          window.location.href = "obrigado.html";
        }, 1500);

        /*
          =========================================================
          AQUI ENTRAM OS EVENTOS (PRÓXIMA ETAPA)
          =========================================================
        */

        // GA4 (Manter desativado, pois já tem no HTML)
        /*if (typeof gtag === "function") {
          gtag("event", "generate_lead", {
            form_name: "contact_form",
            page_location: window.location.href
          });
        }*/

        // Meta Pixel (vamos ativar depois)
        /*
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
        */

      } else {
        // Se o servidor respondeu erro
        formFeedback.textContent = "Erro ao enviar. Tente novamente.";
        formFeedback.style.color = "#ff9f9f";
      }

    } catch (error) {
      // Se deu erro de conexão (ex: sem internet, bloqueio, etc)
      formFeedback.textContent = "Erro de conexão.";
      formFeedback.style.color = "#ff9f9f";
    }
  });
}

/* ------------------------------------------------------
   5) CAPTURA DE CLICKS EM CTAs
   Isso será muito útil quando integrarmos métricas reais.
------------------------------------------------------ */
const heroPrimaryCta = document.getElementById("heroPrimaryCta");
const finalCta = document.getElementById("finalCta");

function handleCtaTracking(ctaName) {
  console.log(`CTA clicado: ${ctaName}`);

  // Exemplo futuro para GA4:
  /*
  if (typeof gtag === "function") {
    gtag("event", "click_cta", {
      cta_name: ctaName,
      page_location: window.location.href
    });
  }
  */

  // Exemplo futuro para Meta Pixel:
  /*
  if (typeof fbq === "function") {
    fbq("trackCustom", "ClickCTA", {
      cta_name: ctaName
    });
  }
  */
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