const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
const RANGE = '시트1!A2:H500';

let values = [];

// 데이터 로드 및 초기화
async function loadData() {
    console.log("Attempting to load data..."); // 로그 추가
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        values = data.values || [];
        displayData(values);
        console.log("Data loaded successfully"); // 성공 로그
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 페이지 로드 시 데이터 로드 및 주기적 업데이트 설정
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setInterval(loadData, 60000); // 1분 간격으로 데이터 새로고침
});

// 나머지 코드는 변경 없음...


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
        detailTd.textContent = row[2];
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

function toggleDetails(mainRow, row) {
    const previouslyExpanded = document.querySelector('.expanded');
    if (previouslyExpanded) {
        previouslyExpanded.previousElementSibling.classList.remove('selected-row');
        previouslyExpanded.remove();
    }

    if (!mainRow.classList.contains('selected-row')) {
        mainRow.classList.add('selected-row');
        const detailTr = document.createElement('tr');
        detailTr.classList.add('expanded');
        const detailTd = document.createElement('td');
        detailTd.setAttribute('colspan', 3);
        detailTd.textContent = `추가 정보: ${row[4]} / ${row[5]}`;
        detailTr.appendChild(detailTd);
        mainRow.parentNode.insertBefore(detailTr, mainRow.nextSibling);
    }
}

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredData = values.filter(row => row[3].toLowerCase().includes(query));
    displayData(filteredData);
});
