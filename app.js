(() => {
  "use strict";

  const questions = [
    { subject: "बेंजामिन नेतन्याहू", x: "0%", y: "0%", expected: "yes" },
    { subject: "नरेंद्र मोदी", x: "33.333%", y: "0%", expected: "yes" },
    {
      subject: "FEMINISM",
      x: "66.666%",
      y: "0%",
      topic: "FEMINISM",
      expected: "no",
    },
    { subject: "कृत्रिम बुद्धिमत्ता", x: "100%", y: "0%", expected: "yes" },
    { subject: "अर्नब गोस्वामी", x: "0%", y: "100%", expected: "yes" },
    { subject: "महात्मा गांधी", x: "33.333%", y: "100%", expected: "no" },
    { subject: "डोनाल्ड ट्रम्प", x: "66.666%", y: "100%", expected: "yes" },
    { subject: "मुकेश अंबानी", x: "100%", y: "100%", expected: "yes" },
  ];

  const body = document.body;
  const video = document.querySelector(".background-video");
  const startButton = document.querySelector(".certification-button");
  const quizStage = document.querySelector(".quiz-stage");
  const lobbyButton = document.querySelector(".lobby-button");
  const paper = document.querySelector(".question-paper");
  const portrait = document.querySelector(".question-portrait");
  const topic = document.querySelector(".question-topic");
  const controls = document.querySelector(".answer-controls");
  const answerButtons = [...document.querySelectorAll(".answer-button")];
  const reward = document.querySelector(".correct-reward");
  const officer = document.querySelector(".officer-jumpscare");
  const flash = document.querySelector(".impact-flash");
  const roaches = [...document.querySelectorAll(".roach")];
  const resultScreen = document.querySelector(".result-screen");
  const certificateCard = document.querySelector(".certificate-card");
  const failureCard = document.querySelector(".failure-card");
  const failureMessage = document.querySelector(".failure-message");
  const certificateScore = document.querySelector(".certificate-score");
  const certificateSerial = document.querySelector(".certificate-serial");
  const downloadButton = document.querySelector(".download-button");
  const restartButtons = [...document.querySelectorAll(".restart-button")];

  let currentQuestion = 0;
  let answers = [];
  let locked = false;
  let certificate = null;
  let sessionId = 0;

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
    topic.textContent = question.topic || "";
    portrait.classList.toggle("has-topic", Boolean(question.topic));
    paper.style.setProperty("--paper-turn", `${index % 2 === 0 ? -1.4 : 1.1}deg`);
    paper.getAnimations().forEach((animation) => animation.cancel());
    paper.style.removeProperty("opacity");
    paper.style.removeProperty("will-change");
    paper.classList.remove("is-no", "is-entering");
    void paper.offsetWidth;
    paper.classList.add("is-entering");
  };

  const startQuiz = async () => {
    if (body.classList.contains("quiz-started")) return;
    sessionId += 1;
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

  const correctSequence = async (activeSession) => {
    paper.classList.remove("is-entering");
    paper.classList.add("is-no");
    await wait(180);
    if (activeSession !== sessionId) return;
    reward.classList.add("is-active");
    await wait(2200);
    reward.classList.remove("is-active");
    if (activeSession !== sessionId) return;
    await wait(80);
  };

  const incorrectSequence = async (activeSession) => {
    paper.classList.remove("is-entering");
    paper.classList.add("is-no");
    await wait(150);
    if (activeSession !== sessionId) return;
    officer.classList.add("is-active");
    await wait(430);
    if (activeSession !== sessionId) return;
    quizStage.classList.add("is-hit");
    flash.classList.add("is-active");
    await wait(400);
    quizStage.classList.remove("is-hit");
    flash.classList.remove("is-active");
    if (activeSession !== sessionId) return;
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

  const showResult = () => {
    const correctCount = answers.filter((answer) => answer.correct).length;
    const wrongCount = questions.length - correctCount;
    const passed = wrongCount === 0;

    paper.hidden = true;
    controls.hidden = true;
    roaches.forEach((roach) => {
      roach.hidden = true;
    });

    certificateCard.hidden = !passed;
    failureCard.hidden = passed;
    downloadButton.hidden = !passed;

    if (passed) {
      certificate = {
        correctCount,
        serial: createSerial(),
        date: new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date()),
      };
      certificateScore.textContent = `सही उत्तर: ${correctCount} / ${questions.length}`;
      certificateSerial.textContent = certificate.serial;
    } else {
      certificate = null;
      const wrongAnswerLabel = wrongCount === 1 ? "गलत उत्तर" : "गलत उत्तरों";
      failureMessage.textContent = `आप ${wrongCount} ${wrongAnswerLabel} के कारण एनपीसी बनने से चूक गए।`;
    }

    resultScreen.classList.add("is-active");
    resultScreen.setAttribute("aria-hidden", "false");
    window.setTimeout(
      () =>
        (passed ? downloadButton : restartButtons[0]).focus({
          preventScroll: true,
        }),
      900,
    );
  };

  const nextQuestion = () => {
    currentQuestion += 1;
    if (currentQuestion >= questions.length) {
      showResult();
      return;
    }

    setQuestion(currentQuestion);
    unlockAnswers();
    answerButtons[0].focus({ preventScroll: true });
  };

  const answerQuestion = async (answer) => {
    if (locked) return;
    const activeSession = sessionId;
    lockAnswers();
    const correct = answer === questions[currentQuestion].expected;
    answers.push({ answer, correct });

    if (correct) {
      await correctSequence(activeSession);
    } else {
      await incorrectSequence(activeSession);
    }

    if (activeSession !== sessionId) return;
    nextQuestion();
  };

  const escapePdfText = (text) =>
    text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");

  const buildPdf = async ({ correctCount, serial, date }) => {
    const watermarkResponse = await fetch("./assets/npc-watermark.jpg", {
      cache: "force-cache",
    });
    if (!watermarkResponse.ok) {
      throw new Error("Watermark could not be loaded");
    }
    const watermark = new Uint8Array(await watermarkResponse.arrayBuffer());
    const encoder = new TextEncoder();
    const score = `${correctCount} / ${questions.length}`;
    const lines = [
      "q",
      "/GS1 gs",
      "330 0 0 330 132 252 cm",
      "/Im1 Do",
      "Q",
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
      "/F2 9 Tf",
      "166 132 Td",
      "(ISSUED BY THE CENTRAL NPC ACCREDITATION COMMITTEE) Tj",
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
      [encoder.encode("<< /Type /Catalog /Pages 2 0 R >>")],
      [encoder.encode("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")],
      [
        encoder.encode(
          "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /ExtGState << /GS1 6 0 R >> /XObject << /Im1 7 0 R >> >> /Contents 8 0 R >>",
        ),
      ],
      [encoder.encode("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")],
      [
        encoder.encode(
          "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        ),
      ],
      [encoder.encode("<< /Type /ExtGState /ca 0.09 /CA 0.09 >>")],
      [
        encoder.encode(
          `<< /Type /XObject /Subtype /Image /Width 720 /Height 720 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${watermark.length} >>\nstream\n`,
        ),
        watermark,
        encoder.encode("\nendstream"),
      ],
      [
        encoder.encode(
          `<< /Length ${encoder.encode(lines).length} >>\nstream\n${lines}\nendstream`,
        ),
      ],
    ];

    const chunks = [encoder.encode("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
    const offsets = [0];
    let byteLength = chunks[0].length;

    objects.forEach((objectChunks, index) => {
      offsets.push(byteLength);
      const prefix = encoder.encode(`${index + 1} 0 obj\n`);
      const suffix = encoder.encode("\nendobj\n");
      chunks.push(prefix, ...objectChunks, suffix);
      byteLength +=
        prefix.length +
        objectChunks.reduce((sum, chunk) => sum + chunk.length, 0) +
        suffix.length;
    });

    const xrefOffset = byteLength;
    let trailer = `xref\n0 ${objects.length + 1}\n`;
    trailer += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      trailer += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    trailer += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    trailer += `startxref\n${xrefOffset}\n%%EOF`;
    chunks.push(encoder.encode(trailer));

    return new Blob(chunks, { type: "application/pdf" });
  };

  const downloadCertificate = async () => {
    if (!certificate) return;
    const label = downloadButton.textContent;
    downloadButton.disabled = true;
    downloadButton.textContent = "प्रमाण-पत्र तैयार हो रहा है…";

    try {
      const url = URL.createObjectURL(await buildPdf(certificate));
      const link = document.createElement("a");
      link.href = url;
      link.download = `npc-certificate-${certificate.serial}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      downloadButton.disabled = false;
      downloadButton.textContent = label;
    }
  };

  const restartQuiz = () => {
    sessionId += 1;
    currentQuestion = 0;
    answers = [];
    certificate = null;
    resultScreen.classList.remove("is-active");
    resultScreen.setAttribute("aria-hidden", "true");
    paper.hidden = false;
    controls.hidden = false;
    certificateCard.hidden = false;
    failureCard.hidden = true;
    downloadButton.hidden = false;
    roaches.forEach((roach) => {
      roach.hidden = false;
      roach.classList.remove("is-squashed");
    });
    setQuestion(0);
    unlockAnswers();
    answerButtons[0].focus({ preventScroll: true });
  };

  const returnToLobby = () => {
    sessionId += 1;
    currentQuestion = 0;
    answers = [];
    certificate = null;
    reward.classList.remove("is-active");
    officer.classList.remove("is-active");
    flash.classList.remove("is-active");
    quizStage.classList.remove("is-hit");
    resultScreen.classList.remove("is-active");
    resultScreen.setAttribute("aria-hidden", "true");
    certificateCard.hidden = false;
    failureCard.hidden = true;
    downloadButton.hidden = false;
    paper.hidden = false;
    controls.hidden = false;
    roaches.forEach((roach) => {
      roach.hidden = false;
      roach.classList.remove("is-squashed");
      roach.style.animationPlayState = "running";
    });
    setQuestion(0);
    unlockAnswers();
    quizStage.setAttribute("aria-hidden", "true");
    startButton.setAttribute("aria-hidden", "false");
    body.classList.remove("quiz-started");
    playVideo();
    window.setTimeout(() => startButton.focus({ preventScroll: true }), 350);
  };

  startButton.addEventListener("click", startQuiz);
  lobbyButton.addEventListener("click", returnToLobby);
  answerButtons.forEach((button) => {
    button.addEventListener("click", () => answerQuestion(button.dataset.answer));
  });
  downloadButton.addEventListener("click", downloadCertificate);
  restartButtons.forEach((button) => {
    button.addEventListener("click", restartQuiz);
  });

  playVideo();
  window.addEventListener("pageshow", playVideo);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playVideo();
  });
})();
