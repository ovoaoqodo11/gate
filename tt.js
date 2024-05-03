const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
let RANGE;

RANGE = '시트3!A2:G500';

let values = [];

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        values = data.values;
        values.sort((a, b) => a[0].localeCompare(b[0]) || a[6].localeCompare(b[6]));
        populateDropdown(values);
        displayData(values);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });


// 검색
document.getElementById('search-input').addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const filteredData = values.filter(row => {
        const companyNameMatch = row[1].toLowerCase().includes(query);
		const nameMatch = row[3].toLowerCase().includes(query);
        const vehicleMatch = row[4].toLowerCase().includes(query);
        const vehicleNumberMatch = row[5].toLowerCase().includes(query);
        const phoneMatch = row[6].toLowerCase().includes(query);
        return companyNameMatch || nameMatch || vehicleMatch || vehicleNumberMatch || phoneMatch;
    });
    displayData(filteredData);
});

// 업체명 필터
document.getElementById('dropdown-filter').addEventListener('change', function(event) {
    const filterValue = event.target.value;
    const filteredData = filterValue ? values.filter(row => row[1] === filterValue) : values;
    displayData(filteredData);
});


        // 업체명 드롭다운 필터 생성
        function populateDropdown(data) {
            const dropdown = document.getElementById('dropdown-filter');
            const uniqueBValues = [...new Set(data.map(row => row[1].replace(/\(주\)/g, '').replace(/㈜/g, '').trim()))];

            dropdown.innerHTML = '<option value="">업체</option>';
            uniqueBValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                dropdown.appendChild(option);
            });
        }

// 데이터 표시 및 추가 정보 표시
function displayData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';

    // 헤더 생성
    const thead = document.createElement('thead');
    const headerRow = ["업체명", "차종", "차량번호"];
    const tr = document.createElement('tr');
    headerRow.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    data.forEach(row => {
        // F열 값이 비어 있으면 해당 행을 건너뛰기
        if (!row[5]) {
            return;
        }

        const tr = document.createElement('tr');

        // 이름, 부서, 출입구역 표시
        const displayOrder = [1, 4, 5];
        displayOrder.forEach(idx => {
            const td = document.createElement('td');
            // 값이 undefined이거나 null이면 빈 문자열로 처리
            td.textContent = (row[idx] === undefined || row[idx] === null) ? '' : row[idx];
            tr.appendChild(td);
        });

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

            // 추가 정보 표시
            const additionalInfo = `등록번호: ${row[0] || '없음'}<br>
                                    직종: ${row[2] || '없음'}<br>
                                    성명: ${row[3] || '없음'}<br>
                                    연락처: ${row[6] || '없음'}`

            detailTd.innerHTML = additionalInfo;

            detailTr.appendChild(detailTd);
            tr.parentNode.insertBefore(detailTr, tr.nextSibling);

            setTimeout(() => detailTr.classList.add('expanded'), 10);
        });

        table.appendChild(tr);
    });
}

document.getElementById('search-input').addEventListener('input', function(e) {
    var searchQuery = e.target.value;
    var searchArea = document.getElementById('search-area');

    // 검색 결과 표시 로직
    if (searchQuery.length > 0) {
        document.getElementById('search-results').innerHTML = '검색 결과: ' + searchQuery;
        document.getElementById('search-results').style.display = 'block';
        searchArea.style.top = '10%'; // 상단으로 이동
    } else {
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('search-results').style.display = 'none';
        searchArea.style.top = '50%'; // 다시 중앙으로 이동
    }
});

// 기존 코드 생략

document.querySelectorAll('.num-key').forEach(function(button) {
    button.addEventListener('click', function() {
        var searchInput = document.getElementById('search-input');

        if (this.classList.contains('clear')) {
            searchInput.value = ''; // 지우기 버튼 클릭 시
        } else {
            searchInput.value += this.textContent; // 숫자 버튼 클릭 시
        }

        // 입력란 이벤트 강제 실행
        searchInput.dispatchEvent(new Event('input'));
    });
});
