let sudoku = Array.from({ length: 9 }, () => Array(9).fill(''));
let solution = Array.from({ length: 9 }, () => Array(9).fill(''));

// Sudoku tablosunu oluşturaalım
function createBoard() {
  const board = document.getElementById("sudokuBoard");
  board.innerHTML = ''; // Önceki board'u temizle
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.createElement('input');
      input.classList.add('form-control', 'sudoku-cell');
      input.setAttribute('type', 'text');
      input.setAttribute('maxlength', '1');
      if ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 0) {
        input.classList.add('sudoku-section');
      }
      input.id = `cell-${i}-${j}`;
      input.addEventListener('input', validateCell); // Hücreye veri girişini kontrol edelim.
      board.appendChild(input);
    }
  }
}

// sudokuyu oluşturmadan önce geçerli bir Sudoku çözümü oluşturuyoruz
function generateSolution() {
  solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSudoku(solution);
}

// Geçerli bir Sudoku çözümünü dolduralım
function fillSudoku(board) {
  const fill = (row, col) => {
    if (row === 9) return true; // Tüm satırlar
    if (col === 9) return fill(row + 1, 0); // Bir satır tamamlandığında bir sonraki satıra geç
    if (board[row][col] !== 0) return fill(row, col + 1); // Dolu hücreleri atlayalım

    const nums = shuffleArray([...Array(9).keys()].map(n => n + 1)); // 1-9 arası sayılar
    for (let num of nums) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (fill(row, col + 1)) return true;
        board[row][col] = 0; // Hata durumunda geri al
      }
    }
    return false;
  };

  fill(0, 0);
}

// Sudoku'da bir sayı geçerli mi kontrol edelim
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false; // Satır ve sütun kontrolü yapalım
    if (board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === num) return false; // 3x3 kutu kontrolü
  }
  return true;
}

// Diziyi karıştıralım 
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Rastgele Sudoku oluşturalım
function generateSudoku() {
  generateSolution(); // Önce çözümü oluşturalım
  const difficulty = document.getElementById("difficulty").value;
  let cellsToRemove = 0;

  switch (difficulty) {   // zorluk derecesine göre 
    case "easy":
      cellsToRemove = 81 - 40;
      break;
    case "medium":
      cellsToRemove = 81 - 45;
      break;
    case "hard":
      cellsToRemove = 81 - 50;
      break;
  }

  resetBoard();
  fillRandomCells(cellsToRemove);
}

// Rastgele hücreleri dolduralım
function fillRandomCells(count) {
  const cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push({ row: i, col: j });
    }
  }
  cells.sort(() => Math.random() - 0.5); // Karıştıralım

  for (let i = 0; i < count; i++) {
    const { row, col } = cells[i];
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.value = solution[row][col];
    cell.setAttribute('readonly', true);  // Hücreyi sadece okunur yap
    sudoku[row][col] = solution[row][col];
  }

  for (let i = count; i < 81; i++) {
    const { row, col } = cells[i];
    sudoku[row][col] = ''; // Boş bırak
  }
}


function resetBoard() {
  sudoku = Array.from({ length: 9 }, () => Array(9).fill(''));
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`);
      cell.value = '';
      cell.removeAttribute('readonly');  // Kilidi kaldır
    }
  }
}


// Kullanıcının doldurduğu tabloyu kontrol edelim
function checkSudoku() {
  const userSudoku = getUserSudoku(); // Kullanıcı sudoku'sunu alalım

  // Boş hücre var mı kontrol et
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (userSudoku[row][col] === "") { // Eğer herhangi bir hücre boşsa
        alert("There are empty fields, please fill in all fields!");
        return; // Boş alan bulunduğu için işlemi burada bitir
      }
    }
  }

  // Eğer boş hücre yoksa, sudoku doğruluğunu kontrol et
  if (isValidSudoku(userSudoku)) {
    alert("Congratulations! Sudoku is correct.");
  } else {
    alert(" Sudoku is wrong, check again! ");
  }
}

// Kullanıcının sudoku tablosundaki değerlerini alalım
function getUserSudoku() {
  let userSudoku = [];
  for (let i = 0; i < 9; i++) {
    userSudoku[i] = [];
    for (let j = 0; j < 9; j++) {
      const cellValue = document.getElementById(`cell-${i}-${j}`).value;
      userSudoku[i][j] = cellValue ? parseInt(cellValue) : '';
    }
  }
  return userSudoku;
}

// Sudoku'nun doğru olup olmadığını kontrol edelim
function isValidSudoku(board) {
  return checkRows(board) && checkColumns(board) && checkBoxes(board);
}

// Satırları kontrol et
function checkRows(board) {
  for (let i = 0; i < 9; i++) {
    const row = board[i];
    if (!isValidGroup(row)) return false;
  }
  return true;
}

// Sütunları kontrol et
function checkColumns(board) {
  for (let i = 0; i < 9; i++) {
    const col = [];
    for (let j = 0; j < 9; j++) {
      col.push(board[j][i]);
    }
    if (!isValidGroup(col)) return false;
  }
  return true;
}

// 3x3'lük kutuları kontrol et
function checkBoxes(board) {
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      const box = [];
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          box.push(board[i + k][j + l]);
        }
      }
      if (!isValidGroup(box)) return false;
    }
  }
  return true;
}

// Bir grup (satır, sütun veya kutu) içinde 1-9 arasındaki rakamların sadece birer kez olup olmadığını kontrol et
function isValidGroup(group) {
  const filtered = group.filter(val => val !== ''); // Boş hücreleri çıkart
  const set = new Set(filtered); // Aynı değerler set içinde tekrarlanmaz
  return filtered.length === set.size && filtered.length === 9;
}

// Sudoku'nun çözümünü göster
function showSolution() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (document.getElementById(`cell-${i}-${j}`).value === '') {
        document.getElementById(`cell-${i}-${j}`).value = solution[i][j];
      }
    }
  }
  
}

// Hücrelerdeki veri girişini doğrula
function validateCell(event) {
  const input = event.target;
  const value = input.value;

  if (value && !/^[1-9]$/.test(value)) {
    alert("Please enter only numbers 1-9");
    input.value = ''; // Hücreyi temizle
    input.focus(); // Hücreye odaklan
  }
}

document.getElementById("generateBtn").addEventListener("click", generateSudoku);
document.getElementById("checkBtn").addEventListener("click", checkSudoku);
document.getElementById("solveBtn").addEventListener("click", showSolution);

// Sayfa yüklendiğinde tablo oluştur
window.onload = createBoard;
