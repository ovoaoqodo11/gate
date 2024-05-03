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
        displayData(values);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 데이터 표시
function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '<tr><th>업체명</th><th>운전자</th><th>자재</th><th>차량번호</th></tr>';

    data.forEach(row => {
        const tr = document.createElement('tr');
        // A열, B열, C열, D열 데이터 추가
        row.slice(0, 4).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        // 행 클릭 이벤트 핸들러 추가
        tr.addEventListener('click', () => {
            toggleDetails(tr, row);
        });

        table.appendChild(tr);
    });

    if (data.length === 0) {
        table.innerHTML += '<tr><td colspan="4" style="text-align: center;">검색된 데이터가 없습니다.</td></tr>';
    }
}

// 상세 정보 토글
function toggleDetails(tr, row) {
    // 이전에 확장된 행이 있으면 제거
    const previouslyExpanded = document.querySelector('.expanded');
    if (previouslyExpanded) {
        previouslyExpanded.previousElementSibling.classList.remove('selected-row');
        previouslyExpanded.remove();
    }

    // 현재 선택된 행이 이전에 선택된 행이 아니면, 상세 정보 추가
    if (!tr.classList.contains('selected-row')) {
        tr.classList.add('selected-row');
        const detailTr = document.createElement('tr');
        detailTr.classList.add('expanded');

        // E열, F열 정보를 상세 행에 추가
        const detailTd = document.createElement('td');
        detailTd.setAttribute('colspan', 4);
        detailTd.textContent = `추가 정보: ${row[4]} / ${row[5]}`;
        detailTr.appendChild(detailTd);
        tr.parentNode.insertBefore(detailTr, tr.nextSibling);
    }
}

// 검색 기능
document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredData = values.filter(row => row[3].toLowerCase().includes(query)); // 차량번호 기준 검색
    displayData(filteredData);
});

// 페이지 로드 시 데이터 로드
document.addEventListener('DOMContentLoaded', loadData);
