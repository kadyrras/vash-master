"use strict";

(function () {
  var PHONES = {
    keruen: "tel:+77172795592",
    saryarka: "tel:+77172515606"
  };
  var OPEN_HOUR = 10;
  var CLOSE_HOUR = 22;

  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var headerCall = document.getElementById("headerCall");
  var heroCall = document.getElementById("heroCall");
  var branchButtons = document.querySelectorAll(".branch-switch button");
  var tabs = document.querySelectorAll(".tab");
  var cards = document.querySelectorAll("[data-branch-card]");

  /* ---------- Бургер-меню ---------- */
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960) setMenu(false);
  });

  /* ---------- Плавный скролл по якорям ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.pushState) history.pushState(null, "", id);
    });
  });

  /* ---------- Выбор филиала: шапка + табы контактов ---------- */
  function setBranch(branch) {
    headerCall.setAttribute("href", PHONES[branch]);
    heroCall.setAttribute("href", PHONES[branch]);
    branchButtons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.branch === branch);
    });
    setFilter(branch);
  }

  function setFilter(filter) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.filter === filter;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    cards.forEach(function (card) {
      card.hidden = !(filter === "all" || card.dataset.branchCard === filter);
    });
  }

  branchButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { setBranch(btn.dataset.branch); });
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.dataset.filter;
      if (filter === "all") {
        setFilter("all");
      } else {
        setBranch(filter);
      }
    });
  });

  /* ---------- Статус «открыто сейчас» (время Астаны, UTC+5) ---------- */
  function updateStatus() {
    var now = new Date(Date.now() + 5 * 3600 * 1000);
    var h = now.getUTCHours();
    var m = now.getUTCMinutes();
    var isOpen = h >= OPEN_HOUR && h < CLOSE_HOUR;

    document.getElementById("clock").textContent =
      (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;

    document.querySelectorAll("[data-status]").forEach(function (dot) {
      dot.classList.toggle("is-open", isOpen);
      dot.classList.toggle("is-closed", !isOpen);
    });
    document.querySelectorAll("[data-status-text]").forEach(function (el) {
      el.textContent = isOpen ? "Открыто до 22:00" : "Откроемся в 10:00";
    });
  }

  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Год в футере ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
