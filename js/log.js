/*
 * 작업 일지 (log.html 전용).
 * 기록은 서버가 아니라 이 브라우저의 localStorage 에만 저장됩니다.
 * → 폰을 바꾸거나 브라우저 데이터를 지우면 사라지니, 가끔 CSV로 내려받아 두세요.
 */

var STORAGE_KEY = "golmok-worklog";

// ── 저장소 ────────────────────────────────────────────────
function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ── 작업 종류 목록 ────────────────────────────────────────
// data/site-data.js 의 🟢 초록 · 🟡 노랑 메뉴를 그대로 가져옵니다.
function fillTaskOptions() {
  var select = document.getElementById("f-task");

  SITE_DATA.serviceTiers.forEach(function (tier) {
    if (tier.id === "red") return;

    var group = document.createElement("optgroup");
    group.label = tier.badge + " " + tier.title;

    tier.items.forEach(function (item) {
      var option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      group.appendChild(option);
    });

    select.appendChild(group);
  });

  var etc = document.createElement("option");
  etc.value = "기타";
  etc.textContent = "기타";
  select.appendChild(etc);
}

// ── 표 그리기 ─────────────────────────────────────────────
function makeCell(text, tag) {
  var cell = document.createElement(tag || "td");
  cell.textContent = text;
  return cell;
}

function makeRow(cells, tag) {
  var row = document.createElement("tr");
  cells.forEach(function (text) {
    row.appendChild(makeCell(text, tag));
  });
  return row;
}

function average(numbers) {
  if (!numbers.length) return 0;
  var sum = numbers.reduce(function (a, b) {
    return a + b;
  }, 0);
  return Math.round(sum / numbers.length);
}

function renderStats(entries) {
  var table = document.getElementById("stat-table");
  table.textContent = "";

  if (!entries.length) {
    table.appendChild(makeRow(["아직 기록이 없습니다."]));
    return;
  }

  // 작업 이름별로 묶습니다.
  var groups = {};
  entries.forEach(function (entry) {
    if (!groups[entry.task]) groups[entry.task] = [];
    groups[entry.task].push(entry);
  });

  table.appendChild(
    makeRow(["작업", "건수", "평균 예상", "평균 실제", "평균 이동", "차이"], "th")
  );

  Object.keys(groups).forEach(function (task) {
    var group = groups[task];
    var expected = average(group.map(function (e) { return e.expected; }));
    var actual = average(group.map(function (e) { return e.actual; }));
    var travel = average(group.map(function (e) { return e.travel; }));
    var gap = actual - expected;

    var row = makeRow([
      task,
      group.length + "건",
      expected + "분",
      actual + "분",
      travel + "분",
      (gap > 0 ? "+" : "") + gap + "분",
    ]);

    // 예상보다 오래 걸린 작업은 눈에 띄게 표시합니다 (가격을 올려야 할 후보).
    if (gap > 0) row.lastChild.classList.add("is-over");
    table.appendChild(row);
  });
}

function renderList(entries) {
  var table = document.getElementById("log-table");
  var count = document.getElementById("log-count");

  table.textContent = "";
  count.textContent = entries.length ? "(" + entries.length + "건)" : "";

  if (!entries.length) {
    table.appendChild(makeRow(["첫 작업을 마치면 여기에 쌓입니다."]));
    return;
  }

  table.appendChild(makeRow(["날짜", "작업", "인원", "예상", "실제", "이동", "메모", ""], "th"));

  // 최근 기록이 위로 오도록 뒤집습니다.
  entries.slice().reverse().forEach(function (entry) {
    var row = makeRow([
      entry.date,
      entry.task,
      entry.people + "인",
      entry.expected + "분",
      entry.actual + "분",
      entry.travel + "분",
      entry.note,
    ]);

    var actionCell = document.createElement("td");
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "linkbtn";
    remove.textContent = "삭제";
    remove.addEventListener("click", function () {
      deleteEntry(entry.id);
    });
    actionCell.appendChild(remove);
    row.appendChild(actionCell);

    table.appendChild(row);
  });
}

function render() {
  var entries = loadEntries();
  renderStats(entries);
  renderList(entries);
}

// ── 동작 ──────────────────────────────────────────────────
function deleteEntry(id) {
  if (!confirm("이 기록을 삭제할까요?")) return;

  saveEntries(
    loadEntries().filter(function (entry) {
      return entry.id !== id;
    })
  );
  render();
}

function today() {
  var now = new Date();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function handleSubmit(event) {
  event.preventDefault();

  var entries = loadEntries();
  entries.push({
    id: String(Date.now()),
    date: today(),
    task: document.getElementById("f-task").value,
    people: Number(document.getElementById("f-people").value),
    expected: Number(document.getElementById("f-expected").value),
    actual: Number(document.getElementById("f-actual").value),
    travel: Number(document.getElementById("f-travel").value) || 0,
    note: document.getElementById("f-note").value.trim(),
  });
  saveEntries(entries);

  // 다음 입력을 위해 시간·메모만 비웁니다 (작업 종류는 연속 입력이 잦아 그대로 둡니다).
  document.getElementById("f-expected").value = "";
  document.getElementById("f-actual").value = "";
  document.getElementById("f-note").value = "";

  render();
}

function exportCsv() {
  var entries = loadEntries();
  if (!entries.length) {
    alert("내보낼 기록이 없습니다.");
    return;
  }

  var header = ["날짜", "작업", "인원", "예상(분)", "실제(분)", "이동(분)", "메모"];

  var rows = entries.map(function (entry) {
    return [entry.date, entry.task, entry.people, entry.expected, entry.actual, entry.travel, entry.note];
  });

  var csv = [header].concat(rows)
    .map(function (row) {
      return row
        .map(function (cell) {
          return '"' + String(cell).replace(/"/g, '""') + '"';
        })
        .join(",");
    })
    .join("\r\n");

  // 맨 앞에 붙인 uFEFF 표시가 있어야 엑셀에서 한글이 깨지지 않습니다.
  var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);

  var link = document.createElement("a");
  link.href = url;
  link.download = "골목집사-작업일지-" + today() + ".csv";
  link.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm("기록을 전부 지웁니다. 되돌릴 수 없습니다.\nCSV로 먼저 내려받으셨나요?")) return;

  localStorage.removeItem(STORAGE_KEY);
  render();
}

// ── 시작 ──────────────────────────────────────────────────
fillTaskOptions();
render();

document.getElementById("log-form").addEventListener("submit", handleSubmit);
document.getElementById("export-csv").addEventListener("click", exportCsv);
document.getElementById("clear-all").addEventListener("click", clearAll);
