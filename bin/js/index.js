const SE = document.querySelectorAll('.se');
const SONG_SLIDE = document.getElementById('SONG_SLIDE');
const LEVEL = document.getElementById('LEVEL');
let level = ['NORMAL', 'HARD', 'MASTER'];
let dir_level = ['normal', 'hard', 'master'];
for (let songs = 0; songs < SONG_DATA.length; songs++)
    SONG_SLIDE.insertAdjacentHTML('afterbegin', `<p class="song-title"><img src="data/_songdata/${SONG_DATA[songs].title}/jacket.jpg" />${SONG_DATA[songs].title}</p>`);

let song_idx = 0;
if (localStorage.getItem('song_idx')) song_idx = localStorage.getItem('song_idx');
let level_idx = 0;
if (localStorage.getItem('level_idx')) level_idx = localStorage.getItem('level_idx');


function set_song(x) {
    let song_img = document.getElementById('SONG_IMG');
    let song_demo = document.getElementById('SONG_DEMO');

    document.getElementById('BACK').setAttribute('src', `data/_songdata/${SONG_DATA[x].title}/back.jpg`);
    song_img.setAttribute('src', `data/_songdata/${SONG_DATA[x].title}/jacket.jpg`);
    song_demo.setAttribute('src', `data/_songdata/${SONG_DATA[x].title}/demo.mp3`);
    song_demo.play();
    LEVEL.innerHTML = `<span class="dif ${level[level_idx]}">${level[level_idx]}</span> <span class="lev">Lv.${SONG_DATA[song_idx].level[level_idx]}<span>`;
    document.getElementById('SONG_JACKET').style.animation = (151 - SONG_DATA[song_idx].level[level_idx] * 10) * 0.01 + 's infinite alternate shadow';
    SONG_SLIDE.style.top = (song_idx - (SONG_DATA.length - 3)) * 7 + 'rem';

    SE[0].currentTime = 0;
    SE[0].play();

    let p = SONG_SLIDE.querySelectorAll('p');
    for (let i = 0; i < SONG_DATA.length; i++) p[i].classList.remove('select');
    p[SONG_DATA.length - 1 - song_idx].classList.add('select');

    localStorage.setItem('song_idx', x);
}
set_song(song_idx);

function set_level() {
    SE[1].currentTime = 0;
    SE[1].play();
    LEVEL.innerHTML = `<span class="dif ${level[level_idx]}">${level[level_idx]}</span> <span class="lev">Lv.${SONG_DATA[song_idx].level[level_idx]}<span>`;
    document.getElementById('SONG_JACKET').style.animation = (151 - SONG_DATA[song_idx].level[level_idx] * 10) * 0.01 + 's infinite alternate shadow';


    localStorage.setItem('level_idx', level_idx);
}
set_level();


function set_score() {
    let SCORE = document.querySelectorAll('.score_int');
    let save_score = JSON.parse(localStorage.getItem('save_score'));
    let full = document.getElementById('FULL');
    get = SONG_DATA[song_idx]['title'];

    for (score in save_score) {
        if (score == SONG_DATA[song_idx]['title'] && save_score[score][level[level_idx]]) {
            let obj = save_score[score][level[level_idx]];
            SCORE[0].innerHTML = obj['rank'];
            SCORE[1].innerHTML = obj['board'];
            SCORE[2].innerHTML = obj['max_combo'];
            SCORE[3].innerHTML = obj['perfect'];
            SCORE[4].innerHTML = obj['good'];
            SCORE[5].innerHTML = obj['bad'];
            SCORE[6].innerHTML = obj['miss'];

            if (obj['bad'] + obj['miss'] + obj['good'] == 0 && obj['max_combo'] > 0) {
                full.innerText = 'ALL PERFECT';
                full.style.display = 'block';
            } else if (obj['bad'] + obj['miss'] == 0 && obj['max_combo'] > 0) {
                full.innerText = 'FULL COMBO';
                full.style.display = 'block';
            } else {
                full.style.display = 'none';
            }
            break;
        } else {
            for (let i = 0; i < SCORE.length; i++) SCORE[i].innerHTML = 0;
            full.style.display = 'none';
        }
    }
}
set_score();


let open_set = false;
window.addEventListener('keydown', (e) => {
    blur = document.getElementById('BULR');
    seting = document.getElementById('SETING');
    SONG_SLIDE.style.transition = '0.3s top';

    if (e.key == 'ArrowUp') {
        if (song_idx != SONG_DATA.length - 1) {
            song_idx++;
            set_song(song_idx);
            set_score();
        }
    }
    if (e.key == 'ArrowDown') {
        if (song_idx != 0) {
            song_idx--;
            set_song(song_idx);
            set_score();
        }
    }
    if (e.key == ' ') {
        if (SONG_DATA[song_idx].level[level_idx] == 0) {
            SE[3].currentTime = 0;
            SE[3].play()
        } else {
            SE[2].play();
            blur.style.backdropFilter = 'blur(10px)';
            blur.style.visibility = 'visible';
            setTimeout(() => {
                location.href = `data/_songdata/${SONG_DATA[song_idx].title}/${dir_level[level_idx]}.html`;
            }, 2000);
            setTimeout(() => {
                blur.style.backgroundColor = '#000';
            }, 1000);

            let fade = 1;
            let song_demo = document.getElementById('SONG_DEMO');
            setInterval(() => {
                fade -= 0.02;
                song_demo.volume = fade;
            }, 20);
        }
    }
    if (e.key == 'ArrowLeft') {
        if (level_idx != 0) {
            level_idx--;
            set_level();
            set_score();
        }
    }
    if (e.key == 'ArrowRight') {
        if (level_idx != 2) {
            level_idx++;
            set_level();
            set_score();
        }
    }
    if (e.key == 'Shift') {
        if (!open_set) seting.style.right = 0;
        else seting.style.right = '100vw';
        open_set = !open_set;
        SE[1].currentTime = 0;
        SE[1].play();
    }
})