(function () {
  const data = window.GALA_DATA || { thu: [], chi: [] };

  // Header
  document.getElementById("page-title").textContent = data.title || "Sao kê";
  if (data.subtitle) document.getElementById("page-subtitle").textContent = data.subtitle;

  const fmt = (n) => {
    if (typeof n !== "number" || isNaN(n)) n = 0;
    return n.toLocaleString("vi-VN") + "đ";
  };

  const sum = (arr) => arr.reduce((a, b) => a + ((b.includeInTotal === false) ? 0 : (Number(b.amount) || 0)), 0);
  const totalThu = sum(data.thu);
  const totalChi = sum(data.chi);
  const balance  = totalThu - totalChi;

  // Overview
  document.getElementById("sum-thu").textContent  = fmt(totalThu);
  document.getElementById("sum-chi").textContent  = fmt(totalChi);
  document.getElementById("balance").textContent  = fmt(balance);
  document.getElementById("count-thu").textContent = data.thu.length + " lượt ủng hộ";
  document.getElementById("count-chi").textContent = data.chi.filter((e) => e.includeInTotal !== false).length + " khoản chi được cộng tổng";

  const topThu = [...data.thu].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
  const topChi = [...data.chi].filter((e) => e.includeInTotal !== false).sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
  document.getElementById("top-thu").innerHTML = topThu.map(
    (e) => `<li><span>${escapeHtml(e.name)}</span><span class="amt">${fmt(e.amount)}</span></li>`
  ).join("");
  document.getElementById("top-chi").innerHTML = topChi.map(
    (e) => `<li><span>${escapeHtml(e.name)}</span><span class="amt">${fmt(e.amount)}</span></li>`
  ).join("");

  // Tabs
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.getAttribute("data-tab");
      document.getElementById(id).classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Thu table
  const thuBody = document.getElementById("thu-body");
  const renderThu = (filter = "") => {
    const f = filter.trim().toLowerCase();
    const rows = data.thu
      .map((e, i) => ({ ...e, _i: i }))
      .filter((e) => !f || e.name.toLowerCase().includes(f) || (e.note || "").toLowerCase().includes(f));
    thuBody.innerHTML = rows.map(
      (e, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${escapeHtml(e.name)}</td>
          <td class="num">${fmt(e.amount)}</td>
          <td>${escapeHtml(e.note || "")}</td>
        </tr>`
    ).join("");
    document.getElementById("total-thu").textContent =
      fmt(rows.reduce((a, b) => a + (Number(b.amount) || 0), 0));
  };
  renderThu();
  document.getElementById("search-thu").addEventListener("input", (e) => renderThu(e.target.value));

  // Chi list
  const chiList = document.getElementById("chi-list");
  // Collect all images for lightbox (with their order)
  let allImages = [];
  let imageIndexByItem = []; // for each chi item, [start, count]
  const renderChi = (filter = "") => {
    const f = filter.trim().toLowerCase();
    allImages = [];
    imageIndexByItem = [];
    const rows = data.chi
      .map((e, i) => ({ ...e, _i: i }))
      .filter((e) =>
        !f ||
        e.name.toLowerCase().includes(f) ||
        (e.note || "").toLowerCase().includes(f) ||
        (e.group || "").toLowerCase().includes(f)
      );
    let imgOffset = 0;
    chiList.innerHTML = rows.map((e) => {
      const startIdx = allImages.length;
      const imgs = (e.images || []).map((im, k) => ({ ...im, _name: e.name, _k: k }));
      allImages.push(...imgs);
      const thumbs = imgs.map((im, k) => {
        const isPdf = /\.pdf$/i.test(im.src);
        const inner = isPdf
          ? `<span class="pdf-badge">PDF</span><span>Xem báo giá PDF</span>`
          : `<img src="${im.src}" alt="${escapeAttr(im.caption || "")}" loading="lazy" />`;
        return `<button class="chi-thumb" data-img-idx="${startIdx + k}" title="${escapeAttr(im.caption || "")}">${inner}</button>`;
      }).join("");
      const groupBadge = e.group ? `<div class="chi-group${e.includeInTotal === false ? " summary" : ""}">${escapeHtml(e.group)}</div>` : "";
      const note = e.note ? `<div class="chi-note">${escapeHtml(e.note)}</div>` : "";
      const hasImgs = imgs.length > 0;
      const amountLabel = e.includeInTotal === false ? `${fmt(e.amount)} <span class="excluded-mark">(không cộng tổng)</span>` : fmt(e.amount);
      const toggleBtn = hasImgs
        ? `<button class="chi-toggle" type="button" aria-expanded="false" aria-label="Xem ảnh chứng từ">
             <span class="chi-toggle-text">${imgs.length} ảnh</span>
             <span class="chi-chevron" aria-hidden="true">▾</span>
           </button>`
        : `<span class="chi-toggle chi-toggle-placeholder" aria-hidden="true"></span>`;
      return `
        <article class="chi-card${hasImgs ? "" : " no-images"}${e.includeInTotal === false ? " summary-card" : ""}">
          ${groupBadge}
          <div class="chi-head">
            <h3>${escapeHtml(e.name)}</h3>
            <div class="amt-wrap">
              <div class="amt">${amountLabel}</div>
              ${toggleBtn}
            </div>
          </div>
          ${note}
          ${hasImgs ? `<div class="chi-images" hidden>${thumbs}</div>` : ""}
        </article>`;
    }).join("");

    // Bind expand/collapse toggle
    chiList.querySelectorAll(".chi-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".chi-card");
        if (!card) return;
        const imgs = card.querySelector(".chi-images");
        const expanded = card.classList.toggle("expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        if (imgs) {
          if (expanded) imgs.removeAttribute("hidden");
          else imgs.setAttribute("hidden", "");
        }
      });
    });
    document.getElementById("total-chi").textContent =
      fmt(rows.reduce((a, b) => a + ((b.includeInTotal === false) ? 0 : (Number(b.amount) || 0)), 0));

    // Bind thumb clicks
    chiList.querySelectorAll(".chi-thumb").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(parseInt(btn.dataset.imgIdx, 10)));
    });
  };
  renderChi();
  document.getElementById("search-chi").addEventListener("input", (e) => renderChi(e.target.value));

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbContent = lb.querySelector(".lb-content");
  const lbCaption = document.getElementById("lb-caption");
  let curIdx = 0;
  function openLightbox(idx) {
    if (!allImages.length) return;
    curIdx = ((idx % allImages.length) + allImages.length) % allImages.length;
    showCurrent();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbContent.innerHTML = "";
  }
  function showCurrent() {
    const im = allImages[curIdx];
    if (!im) return;
    const isPdf = /\.pdf$/i.test(im.src);
    lbContent.innerHTML = isPdf
      ? `<iframe src="${im.src}" title="${escapeAttr(im.caption || "")}"></iframe>`
      : `<img src="${im.src}" alt="${escapeAttr(im.caption || "")}" />`;
    lbCaption.textContent = im.caption || "";
  }
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => { curIdx = (curIdx - 1 + allImages.length) % allImages.length; showCurrent(); });
  lb.querySelector(".lb-next").addEventListener("click", () => { curIdx = (curIdx + 1) % allImages.length; showCurrent(); });
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft")  { curIdx = (curIdx - 1 + allImages.length) % allImages.length; showCurrent(); }
    if (e.key === "ArrowRight") { curIdx = (curIdx + 1) % allImages.length; showCurrent(); }
  });

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
