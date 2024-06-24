import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  safePos: any;
  pawnNumber: any;
  playersNumber: any;
  diceValue: any;
  turnOrder: any;
  currentTurn: any;
  sfxPawnMove: any;
  sfxDiceRoll: any;
  sfxInHome: any;
  sfxWin: any;
  outerPosition: any;
  privateAreas: any;
  homeAreas: any;
  lastLine: any;
  currentCell: string;
  area: string;
  elem: HTMLDivElement;
  turnPlayer: string = "USER";
  isCpu: boolean = false;
  amount: number = 1;
  isWinner: boolean;
  winnerColor: any;
  constructor() {

  }

  checkNumberic(event) {
    if ((!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode === 8)))) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.paymentModal()

    this.safePos = [1, 9, 14, 22, 27, 35, 40, 48];
    this.pawnNumber = 4;
    this.playersNumber = 4;
    // const playersNumber = 2;
    this.diceValue = 6;
    this.turnOrder = ['blue', 'green',];
    // let turnOrder = ['yellow', 'blue'];
    this.currentTurn = 0; //blue
    this.sfxPawnMove = new Audio('assets/sounds/sfx_token_move.mp3');
    this.sfxDiceRoll = new Audio('assets/sounds/sfx_dice_roll.mp3');
    this.sfxInHome = new Audio('assets/sounds/sfx_in_home.mp3');
    this.sfxInHome.volume = 0.1;
    this.sfxWin = new Audio('assets/sounds/sfx_win.mp3');
    this.privateAreas = {
      blue: [],
      // red: [],
      green: [],
      // yellow: []
    };
    this.outerPosition = this.Position(52);
    this.lastLine = {
      blue: this.Position(5),
      // red: new Position(5),
      green: this.Position(5),
      // yellow: new Position(5)
    };
    this.homeAreas = {
      blue: [],
      // red: [],
      green: [],
      // yellow: []
    };

  }

  Position(length) {
    let data = {}
    for (let i = 1; i <= length; i++) {
      data[i] = [];
    }
    return data;
  }

  Pawn(id, color) {
    let name, startCell, endCell;
    // this.id = id;
    name = color + "-" + id;
    color = color;
    switch (color) {
      case 'blue':
        startCell = '1';
        endCell = '51';
        break;
      case 'red':
        startCell = '14';
        endCell = '12';
        break;
      case 'green':
        startCell = '27';
        endCell = '25';
        break;
      case 'yellow':
        startCell = '40';
        endCell = '38';
        break;
    }
    this.currentCell = color + "-private-" + id;
    this.area = 'private'; //private, outer, last-line, home
    let elem = document.createElement('div');
    elem.classList.add('pawn', name);
    elem.innerHTML = `<img src="assets/img/pawn-${color}.png" alt="${name}">`;
    this.elem = elem;
    return {
      area: this.area,
      color: color,
      currentCell: this.currentCell,
      elem: this.elem,
      endCell: endCell,
      id: id,
      name: name,
      startCell: startCell

    }

  }
  //board 


  logBoard() {
    console.log('board start----');
    console.log("privateAreas", this.privateAreas);
    console.log("outerPosition", this.outerPosition);
    console.log("lastLine", this.lastLine);
    console.log("homeAreas", this.homeAreas);
    console.log('board end----');
  }

  getPawnElem(pawn) {
    return $('.pawn.' + pawn.name)
  }

  putPawn(pawn, targetCell) {
    let isPawnAppend = true;
    // const className = '.cell.'+pawn.currentCell;
    const targetCellElem: any = $('.cell.' + targetCell);
    targetCellElem[0].childNodes.forEach((e, i) => {
      let checkColor = pawn.color == 'blue' ? 'green' : 'blue';
      if (!e.className.includes(pawn.color) && !e.className.includes('star') && !targetCellElem[0].className.includes('blue') && !targetCellElem[0].className.includes('green') && !targetCellElem[0].className.includes('red') && !targetCellElem[0].className.includes('yellow')) {
        let data: any = Array.from(targetCellElem[0].childNodes);
        if (data.filter(p => p.className.includes(checkColor)).length == 1) {
          e.className.split(' ').forEach(x => {
            if (x.includes(checkColor)) {
              let removepawn = targetCell.split('-');
              let addToPrivate = this.outerPosition[removepawn[removepawn.length - 1]][0];
              this.outerPosition[removepawn[removepawn.length - 1]].splice(0, 1);
              this.privateAreas[checkColor].push(addToPrivate);
              let pawnCell = x.split('-');
              this.privateAreas[checkColor].forEach((p) => {
                if (p.id == pawnCell[pawnCell.length - 1]) {
                  p.currentCell = (checkColor + '-private-' + pawnCell[pawnCell.length - 1]);
                  p.area = "private";
                }
              })
              const resetCellElem: any = $('.cell.' + checkColor + '-private-' + pawnCell[pawnCell.length - 1]);
              resetCellElem.append(e);
            }
          })
        }
        else {
          if (i == 0) {
            let removepawn = targetCell.split('-');
            let addToPrivate = this.outerPosition[removepawn[removepawn.length - 1]][this.outerPosition[removepawn[removepawn.length - 1]].findIndex(f => f.color == pawn.color)];
            this.outerPosition[removepawn[removepawn.length - 1]].splice(this.outerPosition[removepawn[removepawn.length - 1]].findIndex(f => f.color == pawn.color), 1);
            this.privateAreas[pawn.color].push(addToPrivate);
            this.privateAreas[pawn.color].forEach((p) => {
              if (p.id && p.id == pawn.id) {
                p.currentCell = (pawn.color + '-private-' + pawn.id);
                p.area = "private";
              }
            })
            const resetCellElem: any = $('.cell.' + pawn.color + '-private-' + pawn.id);
            resetCellElem.append(pawn.elem);
            isPawnAppend = false;
          }
        }
        // targetCellElem[0].removeChild(targetCellElem[0].firstChild);

      }
    })
    if (isPawnAppend) {
      targetCellElem.append(pawn.elem);
    }
    this.sfxPawnMove.play();
  }

  //random dice value function
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }
  //check if all pawns in last line can be moved
  pawnsInLastLineCanMove(color) {
    let canMove = false;
    Object.keys(this.lastLine[color]).forEach(pos => {
      this.lastLine[color][pos].forEach(pawn => {
        if (parseInt(pawn.currentCell) + this.diceValue <= 6) {
          canMove = true;
        }
      });
    });
    return canMove;
  }
  pawnsInPrivateCanMove(color) {
    return this.privateAreas[color].length > 0 && this.diceValue == 6;
  }

  pawnsNumberInOuter(color) {
    let number = 0;
    Object.keys(this.outerPosition).forEach(pos => {
      this.outerPosition[pos].forEach(pawn => {
        if (pawn.color == color) {
          number++;
        }
      });
    });
    return number;
  }

  rollDice() {
    let dice = $('.dashboard .dice-section .dice');
    $(dice).addClass('rolling');
    this.sfxDiceRoll.play();
    $('.dice-value span').text('. . .')
    setTimeout(() => {
      $(dice).removeClass('rolling')
    }, 1300)
    // $(dice).on('animationend', () => {
    //   $(this).removeClass('rolling')
    // });
    $(dice).removeClass('face-' + this.diceValue);
    this.diceValue = this.getRandomInt(4, 7);
    $(dice).addClass('face-' + this.diceValue);

    this.removeHighlightDice();
    setTimeout(() => {
      $('.dice-value span').text(this.diceValue);

      if (
        //check if all pawns are in private area
        (!this.pawnsInPrivateCanMove(this.turnOrder[this.currentTurn]) && !this.pawnsInLastLineCanMove(this.turnOrder[this.currentTurn]) && this.pawnsNumberInOuter(this.turnOrder[this.currentTurn]) == 0) || this.homeAreas[this.turnOrder[this.currentTurn]].length == 4) {

        this.nextTurn();
        this.highlightDice();
        setTimeout(() => {
          if (this.turnPlayer == "USER" && this.diceValue != 6) {
            this.rollDice();
            this.turnPlayer = "CPU";
            this.isCpu = true;
          } else {
            this.turnPlayer = "USER";
            this.isCpu = false;
          }
        }, 1301)
        return;
      }

      //highlight all pawns for the current player
      this.highlightAllPawn(this.turnOrder[this.currentTurn]);
      // nextTurn();
    }, 1000);
    // console.log(diceValue);
  }

  updateDashboard() {
    $('.dashboard').removeClass('blue red green yellow');
    $('.dashboard').addClass(this.turnOrder[this.currentTurn]);
    $('.dashboard .player-name span').text(this.turnOrder[this.currentTurn] + "'s turn");
  }

  nextTurn() {
    if (this.diceValue != 6) {
      this.currentTurn++;
      if (this.currentTurn >= this.turnOrder.length) {
        this.currentTurn = 0;
      }
    }
    this.updateDashboard();
    // console.log('currentTurn', currentTurn);
  }
  getNextCell(pawn) {
    let next = {
      cell: 0,
      area: 'outer'
    }
    let currentCell = parseInt(pawn.currentCell);
    let startCell = parseInt(pawn.startCell);
    let endCell = parseInt(pawn.endCell);
    let nextCell = currentCell + this.diceValue;
    if (pawn.area == 'private') {
      next.area = 'outer';
      next.cell = pawn.startCell;
    } else if (pawn.area == 'outer') {
      if ((currentCell >= endCell - 6 && currentCell <= endCell) && nextCell > endCell) {
        //the pawn will be in the last line
        next.area = 'last-line'
        let remaining = nextCell - endCell;
        next.cell = remaining;
        if (remaining == 6) {
          next.cell = 0;
          next.area = 'home';
        }
      } else {
        if (nextCell > 52) {
          let remaining = nextCell - 52;
          next.cell = remaining;
          //
        } else {
          next.cell = nextCell;
        }
      }

    } else if (pawn.area == 'last-line') {
      if (nextCell == 6) {

        next.cell = 0;
        next.area = 'home';
      } else {
        next.cell = nextCell;
        next.area = 'last-line'
      }
    }
    return next;
  }
  highlightPawn(pawn) {
    this.getPawnElem(pawn).addClass('highlight');
    this.removeEventFromDice();
    $('.pawn.' + pawn.name).on('click', () => {
      //if the pawn is in the private area
      if (pawn.area == 'private') {
        //move the pawn to the starting cell
        pawn.currentCell = pawn.startCell;
        pawn.area = 'outer';
        this.putPawn(pawn, 'out-' + pawn.currentCell);

        //remove the pawn from the private area
        this.privateAreas[pawn.color].splice(this.privateAreas[pawn.color].indexOf(pawn), 1);
        //add the pawn to outerposition
        this.outerPosition[pawn.currentCell].push(pawn);

      } else if (pawn.area == 'outer') {
        //move the pawn to the next cell
        let next = this.getNextCell(pawn);
        //remove the pawn from the current cell
        this.outerPosition[pawn.currentCell].splice(this.outerPosition[pawn.currentCell].indexOf(pawn), 1);
        pawn.currentCell = next.cell;
        pawn.area = next.area;
        if (next.area == 'outer') {
          //add the pawn to the next cell in the outer position
          this.outerPosition[next.cell].push(pawn);
          this.putPawn(pawn, 'out-' + pawn.currentCell);
        } else if (next.area == 'last-line') {
          //add the pawn in the last line
          this.lastLine[pawn.color][next.cell].push(pawn);
          this.putPawn(pawn, pawn.color + "-last-line-" + next.cell);
        } else {
          pawn.currentCell = next.cell;
          pawn.area = next.area;
          //add pawn to home area
          this.homeAreas[pawn.color].push(pawn);
          this.sfxInHome.play();
          this.putPawn(pawn, pawn.color + "-home-" + this.homeAreas[pawn.color].length);
        }
      } else if (pawn.area == 'last-line') {
        let next = this.getNextCell(pawn);
        if (next.area == 'last-line') {
          //remove the pawn from the current cell
          this.lastLine[pawn.color][pawn.currentCell].splice(this.lastLine[pawn.color][pawn.currentCell].indexOf(pawn), 1);
          pawn.currentCell = next.cell;
          this.lastLine[pawn.color][next.cell].push(pawn);
          this.putPawn(pawn, pawn.color + "-last-line-" + next.cell);
        } else {
          //remove the pawn from the current cell
          this.lastLine[pawn.color][pawn.currentCell].splice(this.lastLine[pawn.color][pawn.currentCell].indexOf(pawn), 1);
          pawn.currentCell = next.cell;
          pawn.area = next.area;
          //add pawn to home area
          this.homeAreas[pawn.color].push(pawn);
          this.sfxInHome.play();
          this.putPawn(pawn, pawn.color + "-home-" + this.homeAreas[pawn.color].length);
          if (this.homeAreas[pawn.color].length == 4) {
            this.isWinner = true;
            this.winnerColor = pawn.color;
            let model = document.getElementById('WinnerDice');
            model.click();
          }
        }
      }


      //remove the highlight
      this.removeAllHightlight(pawn.color);
      // logBoard();
      this.nextTurn();
      this.attachEventToDice();
      this.highlightDice();
      this.isCpu = true
      setTimeout(() => {
        if (!this.isWinner) {
          if (this.turnPlayer == "USER" && this.diceValue != 6) {
            this.rollDice();
            this.turnPlayer = "CPU";
            this.isCpu = true;
          } else {
            if (this.turnPlayer == "CPU" && this.diceValue == 6) {
              this.rollDice();
            }
            else {
              this.turnPlayer = "USER";
              this.isCpu = false;
            }
          }
        }

      }, 1301);
    });
  }
  removeHighlightPawn(pawn) {
    this.getPawnElem(pawn).removeClass('highlight');
    $('.pawn.' + pawn.name).unbind();
  }
  highlightAllPawn(color) {
    this.privateAreas[color].forEach((pawn, i) => {
      if (this.diceValue == 6) {
        this.highlightPawn(pawn);
        setTimeout(() => {
          if (i == 0) {
            if (this.turnPlayer == "CPU") {
              let pawnMove: any = $('.pawn.' + pawn.name);
              // pawnMove.click();
            }
          }
        }, 500);

      }
    });
    Object.keys(this.outerPosition).forEach(pos => {
      let randomNumber = Math.floor(Math.random() * this.outerPosition[pos].length)
      this.outerPosition[pos].forEach((pawn, i) => {
        if (pawn.color == color) {
          this.highlightPawn(pawn);
          setTimeout(() => {
            if (i == randomNumber && (this.privateAreas[color].length == 0 || (this.privateAreas[color].length > 0 && this.diceValue != 6))) {
              if (this.turnPlayer == "CPU") {
                let pawnMove: any = $('.pawn.' + pawn.name);
                // pawnMove.click();
              }
            }
          }, 500);
        }
      });
    });
    Object.keys(this.lastLine[color]).forEach(pos => {
      this.lastLine[color][pos].forEach(pawn => {
        if (parseInt(pawn.currentCell) + this.diceValue <= 6) {
          this.highlightPawn(pawn);
        }
      });
    });
  }

  removeAllHightlight(color) {
    this.privateAreas[color].forEach(pawn => {
      this.removeHighlightPawn(pawn);
    });
    Object.keys(this.outerPosition).forEach(pos => {
      this.outerPosition[pos].forEach(pawn => {
        if (pawn.color == color) {
          this.removeHighlightPawn(pawn);
        }
      });
    });
    Object.keys(this.lastLine[color]).forEach(pos => {
      this.lastLine[color][pos].forEach(pawn => {
        if (pawn.color == color) {
          this.removeHighlightPawn(pawn);
        }
      });
    });
    this.homeAreas[color].forEach(pawn => {
      this.removeHighlightPawn(pawn);
    });
  }
  highlightDice() {
    $('.dashboard .dice-section').addClass('highlight');
  }
  removeHighlightDice() {
    $('.dashboard .dice-section').removeClass('highlight');
  }
  attachEventToDice() {
    this.highlightDice();
    $('.dashboard .dice-section').on('click', () => {
      this.rollDice()
    });
  }
  removeEventFromDice() {
    this.removeHighlightDice();
    $('.dashboard .dice-section').unbind();
  }
  //initialize the board

  initGame() {
    //create pawns
    Object.keys(this.privateAreas).forEach(color => {
      for (let i = 1; i <= this.pawnNumber; i++) {
        let pawn: any = this.Pawn(i, color)
        this.privateAreas[color].push(pawn);
        //place them on the board
        this.putPawn(pawn, pawn.currentCell);
      }
    });
    this.attachEventToDice();
    this.updateDashboard();
  }

  paymentModal() {
    let model = document.getElementById('paymentModal');
    model.click();
  }
  playGame() {
    if (!this.amount) {
      alert('Enter Bet Amount')
    }
    else {
      let model = document.getElementById('closeModel')
      model.click()
      this.initGame()
    }
  }
  playAgain() {
    window.location.reload();
  }
}
