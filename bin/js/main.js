window.addEventListener('load', startUp);


let score = { rank: null, board: 0, max_combo: 0, combo: 0, perfect: 0, good: 0, bad: 0, miss: 0 };
let key = ['d', 'f', 'g', 'h', 'j', 'k', ' '];
let keyPush = [false, false, false, false, false, false, false], keyDown = [false, false, false, false, false, false, false], keyUp = [true, true, true, true, true, true, true];
let judgeEl = document.getElementById('judge');
let effect = document.getElementsByClassName('effect');
let combo = document.getElementById('combo');

doubleBool = false;
let beat = 0, block = -1;
let lineNotes = [
    [], [], [], [], [], [], []
];

let line = document.querySelectorAll('.line');
let parentLine = document.getElementById('parentLine');
let musicSource = document.getElementById('musicSource');
let notesData = noteCompile();
let bpm = bpmCompile();
let gameStatus = 'stop';

/**
 * key配列に入力されたkeyを判定
 */
function setupKeyEvent() {
    let patarn = (event, color, down, up) => {
        document.addEventListener(event, (e) => {
            if (e.key == ' ') {
                parentLine.style.backgroundColor = color;
                keyDown[6] = down;
                keyUp[6] = up;
            } else key.forEach((k, i) => {
                if (e.key == k) {
                    line[i].style.backgroundColor = color;
                    keyDown[i] = down;
                    keyUp[i] = up;
                }
            })
        });
    }

    patarn('keydown', 'rgba(255, 255, 255, .05)', true, false);
    patarn('keyup', '', false, true);
}


/**
 * スタートアップ
 */
function startUp() {
    let dif = (window.location.href.split('/').pop().replace(/.html/g, '').toUpperCase());
    document.querySelector('title').innerHTML = `${data.name} | ${dif}`;

    setupKeyEvent();
    document.addEventListener('keydown', (e) => musicStart(e));
}

/**
 * パラメータから曲を参照
 */
function getSong() {
    return new URL(window.location.href).searchParams.get('n');
}

/**
 * 演奏中ループ実行
 */
function gameTick() {
    getKeyPush();
    showNotes();
    data.def();

    if (data.auto)
        auto();
    else
        judge();

    if (gameStatus == 'start') window.requestAnimationFrame(gameTick);
}

/**
 * 押した瞬間をTrueで返す
 */
function getKeyPush() {
    key.forEach((k, i) => {
        if (keyUp[i]) window.requestAnimationFrame(() => {
            if (keyDown[i] && !(keyPush[i])) {
                keyPush[i] = true;
                window.requestAnimationFrame(() => {
                    keyPush[i] = false;
                })
            }
        });
    });
}

/**
 * ノーツ削除
 */
function removeNote(line) {
    lineNotes[line][0].el.remove();
    lineNotes[line].shift();
}

/**
 * 判定
 */
function judge() {

    key.forEach((k, i) => {
        if (keyPush[i] && lineNotes[i].length > 0) {
            if (lineNotes[i][0].y > -6 && lineNotes[i][0].y < 6)
                takeNote('perfect', i);

            else if (lineNotes[i][0].y > -12 && lineNotes[i][0].y < 12)
                takeNote('good', i);

            else if (lineNotes[i][0].y > -24 && lineNotes[i][0].y < 24)
                takeNote('bad', i);

        }
    });
}

/**
 * オート
 */
function auto() {
    key.forEach((k, i) => {
        if (lineNotes[i][0])
            if (true && lineNotes[i][0].y < 0)
                takeNote('perfect', i);
    });
}

/**
 * 判定後の処理
 */
function takeNote(judge, i) {
    if (i == 6) {
        new Audio('../../se/bn.mp3').play();
        if (judge != 'bad') {
            for (let j = 0; j < effect.length; j++) {
                effect[j].style = {};
                window.requestAnimationFrame(() => effect[j].style.animation = 'noteEffect .2s alternate 1 running');
            }
        } else
            combo.innerHTML = 0;
    } else {
        new Audio(`../../se/${judge}.ogg`).play();
        if (judge != 'bad') {
            effect[i].style = {};
            window.requestAnimationFrame(() => effect[i].style.animation = 'noteEffect .2s alternate 1 running');
        } else
            combo.innerHTML = 0;
    }

    viewJudgeEffect(judge);
    removeNote(i);
    score[judge]++;
}

/**
 * 同時押し生成
 */
function double(i, x, y, z) {
    if (notesData[block].substr(i, 1) == x) {
        doubleBool = true;
        lineNotes[y - 1].push(new Note(y - 1, 'd'));
        lineNotes[z - 1].push(new Note(z - 1, 'd'));
    }
}

/**
 * ノーツを生成、流す
 */
function showNotes() {
    if (beat + data.offset < musicSource.currentTime && block != notesData.length - 1) {
        beat = beat + bpm;
        block++;
        for (let i = 0; i < notesData[block].length; i++) {
            setTimeout(() => {
                doubleBool = false;
                if (data.add_double) {
                    for (let j = 0; j < data.add_double.length; j++)
                        double(i, data.add_double[j][0], data.add_double[j][1], data.add_double[j][2]);
                }

                if (notesData[block].substr(i, 1) != 0 && !doubleBool) {
                    let notes_number = notesData[block].substr(i, 1) - 1;
                    lineNotes[notes_number].push(new Note(notes_number, ''));
                }
            }, (bpm / notesData[block].length) * (i * 1000))
        }
    }

    for (let i of lineNotes) for (let j of i)
        j.fall();
}

/**
 * 譜面をコンパイル
 */
function noteCompile() {
    return data.notes.replace(/^#.*\n/g, '').replace(/\r?\n/g, '').split(',');
}

/**
 * BPMを秒数にコンパイル
 */
function bpmCompile() {
    return 4 * 60 / data.bpm;
}

/**
 * ミュージックスタート
 */
function musicStart(e) {
    if (gameStatus == 'stop') {
        gameStatus = 'start';
        console.info('演奏スタート');
        gameTick();

        setTimeout(() => {
            musicSource.currentTime = data.music_offset;
            musicSource.play();
            setTimeout(() => {
                musicSource.currentTime = data.preview;
                preview();
            }, Math.abs(data.music_offset));
        }, data.play_offset)
    } else
        musicReset(e);
}

/**
 * ESCで選択画面に戻る
 */
function musicReset(e) {
    if (e.key == 'Escape')
        location.href = '../../../index.html';
}

/**
 * 判定のエフェクト
 */
function viewJudgeEffect(x) {
    judgeEl.src = `../../img/${x}.png`;
    judgeEl.style = {};
    combo.style = {};
    window.requestAnimationFrame(() => {
        judgeEl.style.animation = 'judgeEffect 1s alternate 1 both';
        combo.style.animation = 'judgeEffect 1s alternate 1 both';
    });

    combo.innerHTML++;
}