const API_KEY = 'AIzaSyDr7DBTHQ7yMdjzTHMhEHedf32F-MNI3DI';
const SHEET_ID = '1WKBpAjV5GPcGjWIMZ3WacI6lboz3IIDpSVg5b4H0AaY';
let RANGE;

RANGE = '시트2!A2:G2000';

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


// 초성 추출 함수
function getInitials(char) {
    const INITIAL_CODE = 44032; // 한글 유니코드 시작 코드
    const INITIAL_CONSONANTS = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];
    const INITIAL_OFFSET = 588; // 초성 인덱스 변환을 위한 오프셋

    const charCode = char.charCodeAt(0);
    if (charCode >= 44032 && charCode <= 55203) {
        const initialIndex = Math.floor((charCode - INITIAL_CODE) / INITIAL_OFFSET);
        return INITIAL_CONSONANTS[initialIndex];
    }
    return char; // 한글이 아닌 경우 그대로 반환
}

// 입력된 쿼리의 초성을 추출하는 함수
function getQueryInitials(query) {
    return [...query].map(char => getInitials(char)).join('');
}

// 전체 이름 검색을 수행하는 함수
function searchByName(query, rowData) {
    return rowData.includes(query);
}

// 초성 검색을 수행하는 함수
function searchByInitials(query, rowData) {
    const convertedQuery = getQueryInitials(query);
    const convertedData = getQueryInitials(rowData);
    return convertedData.includes(convertedQuery);
}

// 검색 이벤트 리스너에서 사용할 함수
document.getElementById('search-input').addEventListener('input', function(event) {
    const query = event.target.value.trim().toLowerCase();
    let filteredData = values.filter(row => searchByName(query, row[1].toLowerCase()));

    // 전체 이름으로 검색된 결과가 없는 경우에만 초성 검색 수행
    if (filteredData.length === 0) {
        filteredData = values.filter(row => searchByInitials(query, row[1].toLowerCase()));
    }

    displayData(filteredData);
});





//업체명리스트
document.getElementById('dropdown-filter').addEventListener('change', function(event) {
    const filterValue = event.target.value;
    const filteredData = filterValue ? values.filter(row => row[0] === filterValue) : values;
    displayData(filteredData);
});


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
    const headerRow = ["이름", "부서", "출입구역"];
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

        // 이름, 부서, 출입구역의 순서로 데이터 추가
        const displayOrder = [1, 0, 4];
        displayOrder.forEach(idx => {
            const td = document.createElement('td');
            td.textContent = row[idx] || ''; // B, A, E열
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

            // 표시할 추가 정보
            const additionalInfo = `출입사유: ${row[3] || '없음'}<br>
                                    출입시간: ${row[6] || '없음'}<br>
                                    연락처: ${row[2] || '없음'}<br>
                                    출입만료: ${row[5] || '없음'}`;

            detailTd.innerHTML = additionalInfo;

            detailTr.appendChild(detailTd);
            tr.parentNode.insertBefore(detailTr, tr.nextSibling);

            setTimeout(() => detailTr.classList.add('expanded'), 10);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}


