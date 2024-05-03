const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
let RANGE;

const currentPage = window.location.pathname;

RANGE = '시트1!A2:H500';

// 활용할 값 초기화
let values = [];
const today = new Date();
const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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
    const filteredData = values.filter(row => row[5] && row[5].toLowerCase().includes(query));
    displayData(filteredData);
}

function handleDropdownChange(event) {
    const filterValue = event.target.value;
    const filteredData = filterValue ? values.filter(row => row[0] === filterValue) : values;
    displayData(filteredData);
}


//업체검색
function populateDropdown(data) {
    const dropdown = document.getElementById('dropdown-filter');
    const uniqueBValues = [...new Set(data.map(row => row[0].replace(/\(주\)/g, '').replace(/㈜/g, '').trim()))];

    dropdown.innerHTML = '<option value="">업체</option>';
    uniqueBValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}


function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}.${day}`;
}

function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';

    // 헤더 생성
    const thead = document.createElement('thead');
    const headerRow = ["업체명", "운전자", "차량번호"];
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

        // A열 값을 조작하여 (주)와 ㈜ 문자열 제거
        row[0] = row[0].replace(/\(주\)/g, '').replace(/㈜/g, '').trim();


        const tr = document.createElement('tr');

        // H열이 "승인"이 아닐 때 해당 행의 폰트 색상만 빨간색으로 변경
//        if (row[7] !== '승인됨') {
//            tr.classList.add('unapproved'); // "승인"되지 않은 항목의 클래스
//        }
        
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
    
    let displayString;
    if (!row[3] || row[3].trim() === "") {
        displayString = "자재없음";
    } else {
        if (row[5] && row[5] !== '0') {
            displayString = `${row[3]} : ${row[5]}${row[4]} (${row[1]})`;
        } else {
            displayString = `${row[3]} (${row[1]})`;
        }
    }

    detailTd.textContent = displayString;

    detailTr.appendChild(detailTd);
    tr.parentNode.insertBefore(detailTr, tr.nextSibling);

    setTimeout(() => detailTr.classList.add('expanded'), 10);
});
        // 날짜, 업체명, 차량번호의 순서로 데이터 추가
        const displayOrder = [0, 1, 5];
        displayOrder.forEach(idx => {
            const td = document.createElement('td');
            if (idx === 2) {
                td.textContent = formatDate(row[2]) || '';  // C열
            } else {
                td.textContent = row[idx] || '';  // A, G열
            }
		

            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

fetchData();
