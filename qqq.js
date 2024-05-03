const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
const RANGE = '시트1!A2:H500';

let values = [];

// 데이터 로드 및 초기화
async function loadData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        values = data.values || [];
        console.log("Loaded data:", values);  // 데이터 로드 로그 확인
        displayData(values);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
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
    const query = event.target.value.toLowerCase();
    console.log("Search query:", query);  // 검색 쿼리 로그 확인
    const filteredData = values.filter(row => row[3] && row[3].toLowerCase().includes(query));
    console.log("Filtered data:", filteredData);  // 필터링 결과 로그 확인
    displayData(filteredData);
});

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setInterval(loadData, 10000); // 데이터를 10초 간격으로 새로 고침
});
