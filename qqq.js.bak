const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
let RANGE;

const currentPage = window.location.pathname;

RANGE = '시트1!A2:H500';

// 활용할 값 초기화
let values = [];
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        values = data.values;
        values.sort((a, b) => a[0].localeCompare(b[0]) || a[5].localeCompare(b[5]));
        populateDropdown(values);
        displayData(values);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

// 이벤트 리스너들
document.getElementById('search-input').addEventListener('input', handleSearchInput);
document.getElementById('dropdown-filter').addEventListener('change', handleDropdownChange);

// 이벤트 핸들러들
function handleSearchInput(event) {
    const query = event.target.value.toLowerCase();
    const filteredData = values.filter(row => row[1] && row[1].toLowerCase().includes(query));  // 차량운전자 기준으로 필터
    displayData(filteredData);
}

function handleDropdownChange(event) {
    const filterValue = event.target.value;
    const filteredData = filterValue ? values.filter(row => row[0] === filterValue) : values;  // 업체명 기준으로 필터
    displayData(filteredData);
}

// 업체 검색을 위한 드롭다운 메뉴 채우기
function populateDropdown(data) {
    const dropdown = document.getElementById('dropdown-filter');
    const uniqueBValues = [...new Set(data.map(row => row[0].trim()))];  // 업체명 기준으로 중복 제거

    dropdown.innerHTML = '<option value="">업체</option>';
    uniqueBValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

// 날짜 형식 변경 함수 (사용하지 않음으로 주석 처리 혹은 제거)
// function formatDate(dateString) {
//     const [year, month, day] = dateString.split('-');
//     return `${month}.${day}`;
// }

function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';

    // 헤더 생성
    const thead = document.createElement('thead');
    const headerRow = ["업체명", "차량운전자", "차량번호"];
    const tr = document.createElement('tr');
    headerRow.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // 본문 생성
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');

        // 클릭 이벤트 리스너 추가
        tr.addEventListener('click', function() {
            const expandedRow = document.querySelector('.expanded');
            const previouslySelected = document.querySelector('.selected-row');

            if (previouslySelected) {
                previouslySelected.classList.remove('selected-row');
            }

            if (expandedRow) {
                expandedRow.classList.remove('expanded');
                setTimeout(() => expandedRow.remove(), 100);
            }

            if (tr === expandedRow?.previousElementSibling) {
                return;
            }

            tr.classList.add('selected-row');

            const detailTr = document.createElement('tr');
            detailTr.classList.add('detail-row', 'slide-down');

            const detailTd = document.createElement('td');
            detailTd.setAttribute('colspan', 3);
            detailTd.textContent = row[4];  // 자재 내용 표시

            detailTr.appendChild(detailTd);
            tr.parentNode.insertBefore(detailTr, tr.nextSibling);

            setTimeout(() => detailTr.classList.add('expanded'), 10);
        });

    // 업체명, 차량운전자, 차량번호 데이터를 행에 추가
    row.slice(0, 3).forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
});
table.appendChild(tbody);

// 데이터가 비어 있을 때의 처리
if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', 3);
    td.textContent = '검색된 데이터가 없습니다.';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    tbody.appendChild(tr);
}
}

// 페이지 로드 시 데이터 표시 함수 호출
document.addEventListener('DOMContentLoaded', () => {
// 초기 데이터 로딩 및 표시 로직 추가 (위의 fetch 코드 참고)
});