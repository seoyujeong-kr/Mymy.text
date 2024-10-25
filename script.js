// Brainstorming, Concluding 메뉴 버튼
const brainstormingBtn = document.getElementById('brainstormingBtn');
const concludingBtn = document.getElementById('concludingBtn');
const brainstormingPanel = document.getElementById('brainstorming');
const concludingPanel = document.getElementById('concluding');

// 메뉴 클릭 시 각각의 패널을 켜고 끄기
brainstormingBtn.addEventListener('click', () => {
    togglePanel(brainstormingPanel);
});

concludingBtn.addEventListener('click', () => {
    togglePanel(concludingPanel);
});

function togglePanel(panel) {
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
    adjustPanels();
}

function adjustPanels() {
    const visiblePanels = document.querySelectorAll('.panel[style*="block"]');
    if (visiblePanels.length === 2) {
        visiblePanels[0].style.flex = '0.5';
        visiblePanels[1].style.flex = '0.5';
    } else if (visiblePanels.length === 1) {
        visiblePanels[0].style.flex = '1';
    }
}



// Brainstorming 화면: 클릭 시 글 작성 기능
const brainstormingCanvas = document.getElementById('brainstormingCanvas');
let selectedNote = null;
let dragNote = null;
let isDraggingBrainstorming = false; 
let clickStartTime = 0;
const CLICK_THRESHOLD = 200; // 클릭으로 인식하는 시간 기준 (200ms)
let zIndexCounter = 1; // 노트의 z-index 값을 관리하기 위한 변수

// 클릭 시 노트 생성 및 선택
brainstormingCanvas.addEventListener('click', (e) => {
    const clickDuration = Date.now() - clickStartTime;
    // 드래그가 아닌 짧은 클릭일 경우에만 노트 생성
    if (!isDraggingBrainstorming && clickDuration < CLICK_THRESHOLD && !e.target.classList.contains('note')) {
        createNoteAt(e.clientX, e.clientY);
    }
    isDraggingBrainstorming = false;
});

// 더블 클릭 시 링크 페이지로 이동
brainstormingCanvas.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'A') {
        window.open(e.target.href, '_blank'); // 링크를 새 탭에서 열기
    }
});

// 노트 이동 (클릭 앤 드래그)
brainstormingCanvas.addEventListener('mousedown', (e) => {
    clickStartTime = Date.now(); // 클릭 시작 시간 기록

    if (e.target.classList.contains('note')) {
        dragNote = e.target;
        dragNote.initialX = e.clientX - dragNote.offsetLeft;
        dragNote.initialY = e.clientY - dragNote.offsetTop;

        // 노트가 클릭되면 z-index 증가
        dragNote.style.zIndex = ++zIndexCounter;
    }
});

brainstormingCanvas.addEventListener('mousemove', (e) => {
    if (dragNote) {
        isDraggingBrainstorming = true;
        const newX = e.clientX - dragNote.initialX;
        const newY = e.clientY - dragNote.initialY;

        // 노트 위치 설정
        dragNote.style.left = `${Math.max(0, newX)}px`;
        dragNote.style.top = `${Math.max(0, newY)}px`;
    }
});

brainstormingCanvas.addEventListener('mouseup', () => {
    dragNote = null; // 드래그할 노트 초기화
});

// 방향키로 z-index 조정
document.addEventListener('keydown', (e) => {
    if (selectedNote) {
        if (e.key === 'ArrowUp') {
            // 위로 이동할 경우 z-index 증가
            selectedNote.style.zIndex = ++zIndexCounter;
        } else if (e.key === 'ArrowDown') {
            // 아래로 이동할 경우 z-index 감소 (0보다 작아지지 않도록 제한)
            const currentZIndex = parseInt(selectedNote.style.zIndex) || 0;
            if (currentZIndex > 0) {
                selectedNote.style.zIndex = --zIndexCounter;
            }
        }
    }
});

// 노트 생성 함수
function createNoteAt(x, y) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.left = `${x - 50}px`; // 노트가 클릭한 지점에 맞게 위치하도록 조정
    note.style.top = `${y - 20}px`;
    note.setAttribute('contenteditable', 'true');

    // 링크 첨부 기능
    attachLink(note);

    brainstormingCanvas.appendChild(note);
    note.focus();
    selectNote(note);
}

// 노트 선택 함수
function selectNote(note) {
    if (selectedNote) {
        selectedNote.classList.remove('selected');
    }
    selectedNote = note;
    selectedNote.classList.add('selected');
}

// 링크 포함 기능
function attachLink(note) {
    note.addEventListener('blur', () => {
        const text = note.innerText;

        // 링크인 경우 <a> 태그로 감싸기
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        if (urlPattern.test(text)) {
            const newHtml = text.replace(urlPattern, '<a href="$&" target="_blank">$&</a>');
            note.innerHTML = newHtml;
        }
    });
}

// Ctrl + D로 선택된 노트를 삭제하는 기능
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'd' && selectedNote) {
        e.preventDefault(); // 기본 브라우저 동작 막기
        selectedNote.remove(); // 선택된 노트 삭제
        selectedNote = null; // 선택된 노트 초기화
    }
});

// 노트 색상 변경 (Alt + 1~7)
document.addEventListener('keydown', (e) => {
    if (e.altKey && selectedNote) {
        const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'pink'];
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < colors.length) {
            selectedNote.style.backgroundColor = colors[index];
        }
    }
});


//화면이동
const brainstormingArea = document.getElementById('brainstorming');
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

brainstormingArea.addEventListener('mousedown', (e) => {
    if (e.button === 1) { // 마우스 휠 클릭 (중간 버튼)
        isDragging = true;
        startX = e.pageX - brainstormingArea.offsetLeft;
        startY = e.pageY - brainstormingArea.offsetTop;
        scrollLeft = brainstormingArea.scrollLeft;
        scrollTop = brainstormingArea.scrollTop;
    }
});

brainstormingArea.addEventListener('mousemove', (e) => {
    if (isDragging) {
        e.preventDefault(); // 기본 드래그 기능 방지
        const x = e.pageX - brainstormingArea.offsetLeft;
        const y = e.pageY - brainstormingArea.offsetTop;
        const walkX = (x - startX); // 움직인 거리
        const walkY = (y - startY);
        brainstormingArea.scrollLeft = scrollLeft - walkX; // 수평 이동
        brainstormingArea.scrollTop = scrollTop - walkY; // 수직 이동
    }
});

brainstormingArea.addEventListener('mouseup', () => {
    isDragging = false; // 드래그 종료
});

brainstormingArea.addEventListener('mouseleave', () => {
    isDragging = false; // 마우스가 영역을 나가면 드래그 종료
});



// Concluding 화면: 페이지 생성 및 넘김 기능
let currentPageIndex = 0;
const concludingCanvas = document.getElementById('concludingCanvas');
let pages = [];

// Ctrl + P로 새로운 페이지 생성
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault(); // 기본 브라우저 동작 막기
        createNewPage();
    }
});

// 새로운 페이지 생성 함수
function createNewPage() {
    const newPage = document.createElement('div');
    newPage.classList.add('page');
    newPage.setAttribute('contenteditable', 'true'); // 페이지에 글을 쓸 수 있도록 설정

    // 페이지 추가
    concludingCanvas.appendChild(newPage);
    pages.push(newPage);

    // 페이지를 전환하기 전에 현재 페이지 숨기기
    if (pages.length > 1) {
        pages[currentPageIndex].style.display = 'none';
    }

    // 새로운 페이지를 보여주고 커서 설정
    currentPageIndex = pages.length - 1;
    pages[currentPageIndex].style.display = 'block';
    newPage.focus();
    
    setCursorToStart(newPage); // 새로운 페이지에 커서 위치 설정
}

// 새로운 페이지에 커서를 첫 줄에 설정하는 함수
function setCursorToStart(page) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(page, 0); // 첫 번째 위치에 커서 설정
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

// 페이지 로드 시 첫 번째 페이지 자동 생성
window.onload = function() {
    createNewPage(); // 첫 번째 페이지 생성
};

// Concluding 화면에서 링크 클릭 시 새 탭에서 열기
function openLinkInConcluding(e) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedNode = range.startContainer;

    // 선택된 노드가 링크일 경우
    if (selectedNode.nodeType === Node.TEXT_NODE) {
        const parentLink = selectedNode.parentElement.closest('a');
        if (parentLink) {
            e.preventDefault();
            window.open(parentLink.href, '_blank'); // 새 탭에서 링크 열기
        }
    } else if (selectedNode.nodeType === Node.ELEMENT_NODE && selectedNode.tagName === 'A') {
        // 링크 요소 클릭 시
        e.preventDefault();
        window.open(selectedNode.href, '_blank'); // 새 탭에서 링크 열기
    }
}

// 결론 화면에 이벤트 리스너 등록
concludingCanvas.addEventListener('dblclick', openLinkInConcluding);


// 페이지 넘기기
function setupConcludingCanvas() {
    let isDragging = false;
    let startX = 0;
    let currentPageIndex = 0;

    concludingCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX; // 드래그 시작 시 X 위치 저장
    });

    concludingCanvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX; // 움직인 거리 계산
            if (deltaX > 50 && currentPageIndex > 0) { // 오른쪽으로 드래그
                pages[currentPageIndex].style.display = 'none'; // 현재 페이지 숨기기
                currentPageIndex--; // 이전 페이지로 이동
                pages[currentPageIndex].style.display = 'block'; // 이전 페이지 보이기
                pages[currentPageIndex].focus(); // 새로운 페이지에 포커스 맞추기
                startX = e.clientX; // 시작 X 위치 재설정
            } else if (deltaX < -50 && currentPageIndex < pages.length - 1) { // 왼쪽으로 드래그
                pages[currentPageIndex].style.display = 'none'; // 현재 페이지 숨기기
                currentPageIndex++; // 다음 페이지로 이동
                pages[currentPageIndex].style.display = 'block'; // 다음 페이지 보이기
                pages[currentPageIndex].focus(); // 새로운 페이지에 포커스 맞추기
                startX = e.clientX; // 시작 X 위치 재설정
            }
        }
    });

    concludingCanvas.addEventListener('mouseup', () => {
        isDragging = false; // 마우스를 떼면 드래그 중지
    });

    concludingCanvas.addEventListener('mouseleave', () => {
        isDragging = false; // 캔버스를 벗어나면 드래그 중지
    });
}

// 페이지 로드 시 이 함수 호출
setupConcludingCanvas();

// Lock 기능 (Ctrl + L)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l' && selectedNote) {
        e.preventDefault(); // 기본 브라우저 동작 막기
        selectedNote.classList.toggle('locked');
    }
});

const notepad = document.getElementById('notepad');

brainstormingCanvas.addEventListener('mousemove', (e) => {
    if (dragNote) {
        // 노트 위치를 마우스 이동에 맞게 조정
        dragNote.style.left = `${e.clientX - dragNote.initialX}px`;
        dragNote.style.top = `${e.clientY - dragNote.initialY}px`;

        // 노트가 캔버스 바깥으로 나가면 캔버스 크기 확장
        const noteRect = dragNote.getBoundingClientRect();
        const canvasRect = brainstormingCanvas.getBoundingClientRect();

        if (noteRect.right > canvasRect.right || noteRect.bottom > canvasRect.bottom) {
            brainstormingCanvas.style.width = `${noteRect.right + 100}px`;
            brainstormingCanvas.style.height = `${noteRect.bottom + 100}px`;
        }
    }
});

// 노트 이동 (클릭 앤 드래그)
brainstormingCanvas.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('note')) {
        dragNote = e.target;
        dragNote.initialX = e.clientX - dragNote.offsetLeft;
        dragNote.initialY = e.clientY - dragNote.offsetTop;
    }
});

// 결론 화면에서도 동일한 드래그 기능 적용
concludingCanvas.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('note')) {
        dragNote = e.target;
        dragNote.initialX = e.clientX - dragNote.offsetLeft;
        dragNote.initialY = e.clientY - dragNote.offsetTop;
    }
});

brainstormingCanvas.addEventListener('mousemove', (e) => {
    if (dragNote) {
        const newX = e.clientX - dragNote.initialX;
        const newY = e.clientY - dragNote.initialY;

        // 노트 위치 설정 (페이지 이동에 영향 없음)
        dragNote.style.left = `${newX}px`;
        dragNote.style.top = `${newY}px`;
    }
});

concludingCanvas.addEventListener('mousemove', (e) => {
    if (dragNote) {
        const newX = e.clientX - dragNote.initialX;
        const newY = e.clientY - dragNote.initialY;

        // 노트 위치 설정 (페이지 이동에 영향 없음)
        dragNote.style.left = `${newX}px`;
        dragNote.style.top = `${newY}px`;
    }
});

brainstormingCanvas.addEventListener('mouseup', () => {
    dragNote = null; // 드래그할 노트 초기화
});
concludingCanvas.addEventListener('mouseup', () => {
    dragNote = null; // 드래그할 노트 초기화
});
