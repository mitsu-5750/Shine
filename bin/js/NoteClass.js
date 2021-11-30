/**
 * ノーツ情報格納オブジェクト
 */
class Note {
    constructor(lane, isDouble) {
        this.lane = lane;
        this.isDouble = isDouble;
        this.y = 110;

        this.show();
    }

    show() {
        if (this.lane == 6) {
            this.el = document.createElement('div');
            this.el.classList.add('bigNote');
        } else {
            this.el = document.createElement('img');
            this.el.src = `bin/notes/${data.type}${this.isDouble}.png`;
            this.el.classList.add('note');
        }
        line[this.lane].insertAdjacentElement('afterbegin', this.el);
    }

    fall() {
        this.y -= 2.1;
        this.el.style.bottom = `${this.y}%`;

        if (this.y < -10) {
            removeNote(this.lane);
            viewJudgeEffect('miss');
            combo.innerHTML = 0;
        }
    }
}