const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
const RANGE = '시트1!A2:H500';

let values = [];
let currentQuery = ''; // 검색 쿼리를 저장할 전역 변수

// 데이터 로드 및 초기화
async function loadData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        values = data.values || [];
        filterAndDisplayData(); // 데이터를 로드하고 현재 검색 쿼리에 맞춰 필터링 후 표시
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 데이터 표시 및 필터링
function filterAndDisplayData() {
    let filteredData = values;
    if (currentQuery) {
        filteredData = values.filter(row => row[3] && row[3].toLowerCase().includes(currentQuery));
    }
    displayData(filteredData);
}

// 데이터 표시
function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '<tr><th>업체명</th><th>운전자</th><th>차량번호</th></tr>';

    data.forEach(row => {
        const mainRow = document.createElement('tr');
        const detailRow = document.createElement('tr');

        [0, 1, 3].forEach(index => {
            const td = document.createElement('td');
            td.textContent = row[index];
            mainRow.appendChild(td);
        });

        const detailTd = document.createElement('td');
        detailTd.textContent = "자재: " + row[2];
        detailTd.setAttribute('colspan', 3);
        detailRow.appendChild(detailTd);

        if (!row[2].trim()) {
            detailRow.style.display = 'none';
        }

        mainRow.addEventListener('click', () => {
            toggleDetails(mainRow, row);
        });

        table.appendChild(mainRow);
        table.appendChild(detailRow);
    });

    if (data.length === 0) {
        table.innerHTML += '<tr><td colspan="3" style="text-align: center;">검색된 데이터가 없습니다.</td></tr>';
    }
}

document.getElementById('search-input').addEventListener('input', (event) => {
    currentQuery = event.target.value.toLowerCase();
    filterAndDisplayData(); // 사용자가 입력할 때마다 쿼리 저장 및 데이터 필터링
});

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setInterval(loadData, 10000); // 데이터를 60초 간격으로 새로 고침
});
