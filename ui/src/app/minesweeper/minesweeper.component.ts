import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  isLoaded = false;
  lose = false;

  board: any;
  boardSize = 0;

  numBombs = 0;
  numFlags = 0;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.size && !!params.numBombs) {
        this.boardSize = params.size;
        this.numBombs = params.numBombs;
        this.numFlags = params.numBombs;
        this.initializeBoard();
        this.isLoaded = true;
      }
    });
  }

  // tslint:disable-next-line: typedef
  initializeBoard() {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      const tempRow = [];
      for (let j = 0; j < this.boardSize; j++) {
        tempRow.push({clicked: false, bomb: false, display: ''});
      }
      this.board.push(tempRow);
    }
    for (let i = 0; i < this.numBombs; i++) {
      while (true) {
        const row = Math.floor(Math.random() * this.boardSize);
        const col = Math.floor(Math.random() * this.boardSize);
        const cell = this.board[row][col];
        if (!cell.bomb) {
          this.board[row][col].bomb = true;
          break;
        }
      }
    }
    this.displayOpenSpaces();
  }

  // tslint:disable-next-line: typedef
  displayOpenSpaces() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.getCellDisplay(i, j) === '') {
          this.board[i][j].clicked = true;
          if (this.getCellDisplay(i - 1, j) !== 'Bomb' && this.getCellDisplay(i - 1, j) !== 'Out of bounds') {
            this.board[i - 1][j].clicked = true;
            this.board[i - 1][j].display = this.getCellDisplay(i - 1,  j);
          }
          if (this.getCellDisplay(i + 1, j) !== 'Bomb' && this.getCellDisplay(i + 1, j) !== 'Out of bounds') {
            this.board[i + 1][j].clicked = true;
            this.board[i + 1][j].display = this.getCellDisplay(i + 1,  j);
          }
        }
      }
    }
  }

  // tslint:disable-next-line: typedef
  getCellDisplay(row: number, col: number) {
    if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
      if (!this.board[row][col].bomb) {
        let surroundingBombs = 0;
        surroundingBombs += this.getBombNumber(row - 1, col - 1);
        surroundingBombs += this.getBombNumber(row - 1, col);
        surroundingBombs += this.getBombNumber(row - 1, col + 1);
        surroundingBombs += this.getBombNumber(row, col - 1);
        surroundingBombs += this.getBombNumber(row, col + 1);
        surroundingBombs += this.getBombNumber(row + 1, col - 1);
        surroundingBombs += this.getBombNumber(row + 1, col);
        surroundingBombs += this.getBombNumber(row + 1, col + 1);
        return surroundingBombs > 0 ? surroundingBombs : '';
      } else {
        return 'Bomb';
      }
    }
    return 'Out of bounds';
  }

  // tslint:disable-next-line: typedef
  getBombNumber(row: number, col: number) {
    if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
      return (this.board[row][col].bomb ? 1 : 0);
    } else {
      return 0;
    }
  }

  // tslint:disable-next-line: typedef
  clickCell(row: number, col: number) {
    this.board[row][col].clicked = true;
    this.board[row][col].display = this.getCellDisplay(row, col);
    if (this.board[row][col].display === 'Bomb') {
      this.lose = true;
    }
  }

  // tslint:disable-next-line: typedef
  flagCell(row: number, col: number) {
    if (this.board[row][col].display !== 'Flag') {
      if (this.numFlags > 0) {
        this.board[row][col].clicked = true;
        this.board[row][col].display = 'Flag';
        if (this.board[row][col].bomb) {
          this.numBombs--;
        }
        this.numFlags--;
      }
    } else {
      this.board[row][col].clicked = false;
      this.board[row][col].display = '';
      if (this.board[row][col].bomb) {
        this.numBombs++;
      }
      this.numFlags++;
    }
  }
}
