/*
 * 메인 페이지(index.html) 전용 코드.
 * 여러 페이지가 함께 쓰는 부분은 js/common.js 에 있습니다.
 * 내용을 바꾸고 싶으면 data/site-data.js 를 고치세요.
 */

// 수요 조사 배너: 구글 폼 링크를 넣었을 때만 화면에 나옵니다.
function fillSurvey() {
  var url = SITE_DATA.survey.url;
  if (!url) return;

  document.getElementById("survey-cta").href = url;
  document.getElementById("survey").hidden = false;
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

fillBindings();
fillContact();
fillSurvey();
setupNav();
renderCards("problem-list", SITE_DATA.problems);
renderServiceTiers();
renderPlans();
renderCards("trust-list", SITE_DATA.trustPoints);
renderSteps("process-list", SITE_DATA.process);

document.title = SITE_DATA.brand.name + " — 원룸 생활 잡일 대행";

registerServiceWorker();
