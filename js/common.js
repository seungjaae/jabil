/*
 * 모든 페이지가 함께 쓰는 코드 (index.html, owner.html).
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

// 오픈채팅 링크가 있으면 문의 버튼을 전부 거기로 연결합니다.
// 링크가 비어 있으면 "준비 중"으로 두고 버튼은 연락처 섹션으로 이동합니다.
function fillContact() {
  var url = SITE_DATA.contact.kakaoOpenChat;
  var kakaoCell = document.getElementById("contact-kakao");

  if (!url) {
    kakaoCell.textContent = "준비 중";
    return;
  }

  var link = document.createElement("a");
  link.className = "link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "오픈채팅으로 문의하기";
  kakaoCell.appendChild(link);

  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener";
  });
}

// 모바일에서 햄버거 버튼으로 메뉴를 여닫습니다. (메뉴가 없는 페이지에서는 아무것도 하지 않습니다)
function setupNav() {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  // 메뉴 안의 링크를 누르면 자동으로 닫습니다.
  nav.addEventListener("click", function (event) {
    if (event.target.tagName !== "A") return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
  });
}

// 아이콘 + 제목 + 설명 카드 목록 (문제점, 신뢰, 건물주 페이지에서 함께 씁니다)
function renderCards(elementId, items) {
  document.getElementById(elementId).innerHTML = items
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

// 번호가 붙은 단계 목록 (이용 방법, 도입 절차에서 함께 씁니다)
function renderSteps(elementId, items) {
  document.getElementById(elementId).innerHTML = items
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

// PWA: 서비스워커 등록 (file:// 로 열면 동작하지 않습니다)
function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}
