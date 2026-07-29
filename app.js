(() => {
  "use strict";

  const questions = [
    { subject: "बेंजामिन नेतन्याहू", x: "0%", y: "0%" },
    { subject: "डोनाल्ड ट्रम्प", x: "33.333%", y: "0%" },
    { subject: "नरेंद्र मोदी", x: "66.666%", y: "0%" },
    { subject: "एलन मस्क", x: "100%", y: "0%" },
    { subject: "कृत्रिम बुद्धिमत्ता", x: "0%", y: "100%" },
    { subject: "सैन्य ड्रोन", x: "33.333%", y: "100%" },
    { subject: "निगरानी कैमरा", x: "66.666%", y: "100%" },
    { subject: "व्यवस्था", x: "100%", y: "100%" },
  ];

  const body = document.body;
  const video = document.querySelector(".background-video");
  const startButton = document.querySelector(".certification-button");
  const quizStage = document.querySelector(".quiz-stage");
  const paper = document.querySelector(".question-paper");
  const portrait = document.querySelector(".question-portrait");
  const controls = document.querySelector(".answer-controls");
  const answerButtons = [...document.querySelectorAll(".answer-button")];
  const officer = document.querySelector(".officer-jumpscare");
  const flash = document.querySelector(".impact-flash");
  const roaches = [...document.querySelectorAll(".roach")];
  const resultScreen = document.querySelector(".result-screen");
  const certificateScore = document.querySelector(".certificate-score");
  const certificateSerial = document.querySelector(".certificate-serial");
  const downloadButton = document.querySelector(".download-button");
  const restartButton = document.querySelector(".restart-button");

  let currentQuestion = 0;
  let answers = [];
  let locked = false;
  let certificate = null;

  const wait = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const playVideo = () => {
    if (!video || body.classList.contains("quiz-started")) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.play().catch(() => {});
  };

  const setQuestion = (index) => {
    const question = questions[index];
    portrait.style.backgroundPosition = `${question.x} ${question.y}`;
    portrait.setAttribute("aria-label", `${question.subject}: समर्थन?`);
    paper.style.setProperty("--paper-turn", `${index % 2 === 0 ? -1.4 : 1.1}deg`);
    paper.classList.remove("is-yes", "is-no", "is-entering");
    void paper.offsetWidth;
    paper.classList.add("is-entering");
  };

  const startQuiz = async () => {
    if (body.classList.contains("quiz-started")) return;
    body.classList.add("quiz-started");
    quizStage.setAttribute("aria-hidden", "false");
    startButton.setAttribute("aria-hidden", "true");
    await wait(520);
    video.pause();
    setQuestion(0);
    answerButtons[0].focus({ preventScroll: true });
  };

  const lockAnswers = () => {
    locked = true;
    controls.classList.add("is-locked");
    answerButtons.forEach((button) => {
      button.disabled = true;
    });
  };

  const unlockAnswers = () => {
    locked = false;
    controls.classList.remove("is-locked");
    answerButtons.forEach((button) => {
      button.disabled = false;
    });
  };

  const yesSequence = async () => {
    const roach = roaches[currentQuestion % roaches.length];
    paper.classList.remove("is-entering");
    paper.classList.add("is-yes");
    await wait(770);
    roach.classList.add("is-squashed");
    flash.classList.add("is-active");
    await wait(330);
    flash.classList.remove("is-active");
    await wait(210);
  };

  const noSequence = async () => {
    paper.classList.remove("is-entering");
    paper.classList.add("is-no");
    await wait(150);
    officer.classList.add("is-active");
    await wait(430);
    quizStage.classList.add("is-hit");
    flash.classList.add("is-active");
    await wait(400);
    quizStage.classList.remove("is-hit");
    flash.classList.remove("is-active");
    await wait(260);
    officer.classList.remove("is-active");
  };

  const createSerial = () => {
    const date = new Date();
    const stamp = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");
    const random = Math.floor(10000 + Math.random() * 90000);
    return `NPC-${stamp}-${random}`;
  };

  const showCertificate = () => {
    const yesCount = answers.filter((answer) => answer === "yes").length;
    certificate = {
      yesCount,
      serial: createSerial(),
      date: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    };

    paper.hidden = true;
    controls.hidden = true;
    roaches.forEach((roach) => {
      roach.hidden = true;
    });
    certificateScore.textContent = `आज्ञाकारिता अंक: ${yesCount} / ${questions.length}`;
    certificateSerial.textContent = certificate.serial;
    resultScreen.classList.add("is-active");
    resultScreen.setAttribute("aria-hidden", "false");
    window.setTimeout(() => downloadButton.focus({ preventScroll: true }), 900);
  };

  const nextQuestion = () => {
    currentQuestion += 1;
    if (currentQuestion >= questions.length) {
      showCertificate();
      return;
    }

    setQuestion(currentQuestion);
    unlockAnswers();
    answerButtons[0].focus({ preventScroll: true });
  };

  const answerQuestion = async (answer) => {
    if (locked) return;
    lockAnswers();
    answers.push(answer);

    if (answer === "yes") {
      await yesSequence();
    } else {
      await noSequence();
    }

    nextQuestion();
  };

  const escapePdfText = (text) =>
    text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");

  const buildPdf = ({ yesCount, serial, date }) => {
    const score = `${yesCount} / ${questions.length}`;
    const lines = [
      "q",
      "0.22 0.23 0.16 RG",
      "2 w",
      "42 42 511 758 re S",
      "0.22 0.23 0.16 rg",
      "BT",
      "/F2 28 Tf",
      "152 720 Td",
      `(NPC CERTIFICATE) Tj`,
      "ET",
      "0.5 w",
      "110 695 m 485 695 l S",
      "BT",
      "/F1 12 Tf",
      "229 650 Td",
      "(THIS CERTIFIES THAT) Tj",
      "ET",
      "BT",
      "/F2 22 Tf",
      "184 605 Td",
      "(ANONYMOUS SUBJECT) Tj",
      "ET",
      "BT",
      "/F1 13 Tf",
      "105 550 Td",
      "(has completed the eight-question compliance assessment.) Tj",
      "ET",
      "BT",
      "/F2 17 Tf",
      "198 492 Td",
      `(NPC SCORE: ${escapePdfText(score)}) Tj`,
      "ET",
      "0.8 w",
      "229 370 138 138 re S",
      "BT",
      "/F2 30 Tf",
      "267 425 Td",
      "(NPC) Tj",
      "ET",
      "BT",
      "/F1 10 Tf",
      "72 96 Td",
      `(ISSUED: ${escapePdfText(date)}) Tj`,
      "355 0 Td",
      `(${escapePdfText(serial)}) Tj`,
      "ET",
      "Q",
    ].join("\n");

    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
      `<< /Length ${new TextEncoder().encode(lines).length} >>\nstream\n${lines}\nendstream`,
    ];

    let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(new TextEncoder().encode(pdf).length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = new TextEncoder().encode(pdf).length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefOffset}\n%%EOF`;

    return new Blob([new TextEncoder().encode(pdf)], { type: "application/pdf" });
  };

  const downloadCertificate = () => {
    if (!certificate) return;
    const url = URL.createObjectURL(buildPdf(certificate));
    const link = document.createElement("a");
    link.href = url;
    link.download = `npc-certificate-${certificate.serial}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const restartQuiz = () => {
    currentQuestion = 0;
    answers = [];
    certificate = null;
    resultScreen.classList.remove("is-active");
    resultScreen.setAttribute("aria-hidden", "true");
    paper.hidden = false;
    controls.hidden = false;
    roaches.forEach((roach) => {
      roach.hidden = false;
      roach.classList.remove("is-squashed");
    });
    setQuestion(0);
    unlockAnswers();
    answerButtons[0].focus({ preventScroll: true });
  };

  startButton.addEventListener("click", startQuiz);
  answerButtons.forEach((button) => {
    button.addEventListener("click", () => answerQuestion(button.dataset.answer));
  });
  downloadButton.addEventListener("click", downloadCertificate);
  restartButton.addEventListener("click", restartQuiz);

  playVideo();
  window.addEventListener("pageshow", playVideo);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playVideo();
  });
})();
