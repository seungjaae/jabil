/*
 * 건물주 페이지(owner.html) 전용 코드.
 * 여러 페이지가 함께 쓰는 부분은 js/common.js 에 있습니다.
 * 내용을 바꾸고 싶으면 data/site-data.js 의 owner 항목을 고치세요.
 */

function renderOfferIncludes() {
  document.getElementById("owner-includes").innerHTML = SITE_DATA.owner.offer.includes
    .map(function (item) {
      return "<li>" + item + "</li>";
    })
    .join("");
}

fillBindings();
fillContact();
setupNav();
renderCards("owner-pains", SITE_DATA.owner.pains);
renderOfferIncludes();
renderCards("owner-reasons", SITE_DATA.owner.reasons);
renderSteps("owner-steps", SITE_DATA.owner.steps);

document.title = SITE_DATA.brand.name + " — 원룸 건물주 안내";

registerServiceWorker();
