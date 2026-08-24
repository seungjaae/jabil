/*
 * data/site-data.js 의 내용을 화면에 그려주는 코드.
 * 내용을 바꾸고 싶으면 이 파일이 아니라 data/site-data.js 를 고치세요.
 */

// "brand.name" 같은 문자열로 데이터에서 값을 꺼냅니다.
function getValue(path) {
  return path.split(".").reduce(function (obj, key) {
    return obj == null ? undefined : obj[key];
  }, SITE_DATA);
}

// data-bind 속성이 붙은 요소에 값을 채웁니다.
function fillBindings() {
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var value = getValue(el.dataset.bind);
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll("[data-bind-href]").forEach(function (el) {
    var parts = el.dataset.bindHref.split(":");
    var value = getValue(parts[1]);
    if (value != null) el.href = parts[0] + ":" + value;
  });
}

function renderProblems() {
  document.getElementById("problem-list").innerHTML = SITE_DATA.problems
    .map(function (item) {
      return (
        '<article class="card">' +
        '<div class="card__icon">' + item.icon + "</div>" +
        '<h3 class="card__title">' + item.title + "</h3>" +
        '<p class="card__body">' + item.body + "</p>" +
        "</article>"
      );
    })
    .join("");
}

function renderServiceTiers() {
  document.getElementById("service-tiers").innerHTML = SITE_DATA.serviceTiers
    .map(function (tier) {
      var items = tier.items
        .map(function (item) {
          return (
            '<li class="tier__item">' +
            "<div>" +
            '<div class="tier__name">' + item.name + "</div>" +
            (item.desc ? '<p class="tier__desc">' + item.desc + "</p>" : "") +
            "</div>" +
            '<div class="tier__meta">' +
            '<div class="tier__price">' + item.price + "</div>" +
            (item.time ? '<p class="tier__time">' + item.time + "</p>" : "") +
            "</div>" +
            "</li>"
          );
        })
        .join("");

      return (
        '<section class="tier tier--' + tier.color + '">' +
        '<header class="tier__head">' +
        '<span class="tier__badge">' + tier.badge + "</span>" +
        "<div>" +
        '<h3 class="tier__title">' + tier.title + "</h3>" +
        '<p class="tier__subtitle">' + tier.subtitle + "</p>" +
        "</div>" +
        "</header>" +
        '<ul class="tier__list">' + items + "</ul>" +
        "</section>"
      );
    })
    .join("");
}

function renderPlans() {
  document.getElementById("plan-list").innerHTML = SITE_DATA.subscription.plans
    .map(function (plan) {
      var features = plan.features
        .map(function (feature) {
          return "<li>" + feature + "</li>";
        })
        .join("");

      return (
        '<article class="card plan' + (plan.highlight ? " plan--highlight" : "") + '">' +
        (plan.highlight ? '<span class="plan__flag">추천</span>' : "") +
        '<div class="plan__name">' + plan.name + "</div>" +
        '<div class="plan__price">' + plan.price + "</div>" +
        '<p class="plan__target">' + plan.target + "</p>" +
        '<ul class="plan__features">' + features + "</ul>" +
        "</article>"
      );
    })
    .join("");
}

function renderTrust() {
  document.getElementById("trust-list").innerHTML = SITE_DATA.trustPoints
    .map(function (point) {
      return (
        '<article class="card">' +
        '<div class="card__icon">' + point.icon + "</div>" +
        '<h3 class="card__title">' + point.title + "</h3>" +
        '<p class="card__body">' + point.body + "</p>" +
        "</article>"
      );
    })
    .join("");
}

function renderProcess() {
  document.getElementById("process-list").innerHTML = SITE_DATA.process
    .map(function (item) {
      return (
        '<li class="step">' +
        '<span class="step__num">' + item.step + "</span>" +
        "<div>" +
        '<h3 class="step__title">' + item.title + "</h3>" +
        '<p class="step__body">' + item.body + "</p>" +
        "</div>" +
        "</li>"
      );
    })
    .join("");
}

fillBindings();
renderProblems();
renderServiceTiers();
renderPlans();
renderTrust();
renderProcess();

document.title = SITE_DATA.brand.name + " — 원룸 생활 잡일 대행";

// PWA: 서비스워커 등록 (file:// 로 열면 동작하지 않습니다)
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}
