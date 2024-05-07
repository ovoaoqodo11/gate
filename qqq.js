const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
const RANGE = '시트1!A2:H500';

let values = [];
let currentQuery = ''; // 현재 검색 쿼리를 저장하는 전역 변수
let lastModified = ''; // 마지막 데이터 로드 시간을 저장하는 변수

// 데이터 로드 및 검색 쿼리에 따라 필터링하여 표시
async function loadData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        values = data.values || [];
        filterAndDisplayData(); // 데이터 로드 후 현재 검색 쿼리에 따라 데이터 필터링 및 표시
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 데이터 필터링 및 표시
function filterAndDisplayData() {
    let filteredData = values;
    if (currentQuery) { // 현재 검색 쿼리가 있으면 필터링 수행
        filteredData = values.filter(row => row[3] && row[3].toLowerCase().includes(currentQuery));
    }
    displayData(filteredData);
}

// 데이터 표시 함수
function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '<tr><th>업체명</th><th>운전자</th><th>차량번호</th></tr>';

    data.forEach(row => {
        const mainRow = document.createElement('tr');
        const detailRow = document.createElement('tr');
        detailRow.style.display = 'none'; // 자재 행을 기본적으로 숨김

        [0, 1, 3].forEach(index => {
            const td = document.createElement('td');
            td.textContent = row[index];
            mainRow.appendChild(td);
        });

        const detailTd = document.createElement('td');
        detailTd.textContent = "자재: " + row[2];
        detailTd.setAttribute('colspan', 3);
        detailRow.appendChild(detailTd);

        mainRow.addEventListener('click', () => {
            toggleDetails(detailRow); // 메인 행을 터치하면 상세 행 토글
        });

        table.appendChild(mainRow);
        table.appendChild(detailRow);
    });

    if (data.length === 0) {
        table.innerHTML += '<tr><td colspan="3" style="text-align: center;">검색된 데이터가 없습니다.</td></tr>';
    }
}

// 상세 정보 토글 기능
function toggleDetails(detailRow) {
    if (detailRow.style.display === 'none') {
        detailRow.style.display = '';
    } else {
        detailRow.style.display = 'none';
    }
}

// 검색 입력 처리
document.getElementById('search-input').addEventListener('input', (event) => {
    currentQuery = event.target.value.toLowerCase();
    filterAndDisplayData(); // 검색 쿼리 변경 시 데이터 필터링 및 표시
});

// 초기 데이터 로드 및 주기적 업데이트 설정
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setInterval(loadData, 20000); // 60초 간격으로 데이터 새로 고침
});
