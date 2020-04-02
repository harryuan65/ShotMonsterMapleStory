//  16px  的margin top
//   *
//  118px 的footer
//  window_height = 694
// * = 694 - 134 / 63
var total_box = 0;
var box_num = 0;
var score = 0;
var box_count = 1;
var currentMonsterIndex = 0;
var currentAtk = 3000;
var baseScore = 0;
// var scoreRange = [0, 30, 70, 120, 180, 250, 330];
var scoreRange = [0, 3, 7, 12, 15, 17, 19];
var monsters = ['orange_mushroom','fat','fat2','fat3','fat4'];
var bossHealth = 130000;
var bossName = 'christmas_giant_slime';

window.onload = ()=>{
  setkillkey();
  load_monster(currentMonsterIndex);
}
function load_monster(currentMonsterIndex){
  console.log("Game initializing:...");
  var score_h = document.getElementById("score_bar").clientHeight;
  var footer_h = document.getElementById("foot").clientHeight;
  var window_height = window.innerHeight;
  var monster_height = 90;
  var row_count = parseInt((window_height-score_h-footer_h)/monster_height);
  total_box = row_count;
  console.log(`Add ${row_count} rows`);
  for(let i=0;i<row_count;i++){
    addrow(currentMonsterIndex);
  }
  console.log("Game initialized!");
}

function addrow(monsterIndex=0){
  box_num++;
  var base = document.getElementById("wrapper_out");
  var row = document.createElement("div");
  row.className="wrapper_box";
  row.id="box_"+box_num.toString();

  var debug = document.createElement('p');
  debug.innerHTML=box_num.toString()
  row.appendChild(debug);

  var monsterPosition = parseInt((Math.random()*10)%3);
  for (let i=0;i<3;i++){
    var row_item = document.createElement('div');
    row_item.className="item";
    if(i==monsterPosition){
      // row_item.setAttribute('src','static/or.gif')
      row_item.classList.add(monsters[monsterIndex]);
      row_item.id=`monster_${box_num}`;
    }
    row.appendChild(row_item);
  }
  row.setAttribute('name',monsterPosition); //put monster position using attr 'name' to kill
  //var old_box = document.getElementById("box_"+box_num);
  base.insertBefore(row,base.childNodes[0]);
  // console.log(`Added row (name=monster=${monsterPosition} box_num=${box_num})`);
}

function printinfo(){
  var height = document.body.clientHeight;
  var width = document.body.clientWidth;
  console.log(">>document: h=",height,"w = ",width);
  var window_height = window.innerHeight;
  var window_width = window.innerWidth;
  console.log(">>window: h=",window_height,"w = ",window_width);

  var footer_h = document.getElementById("foot").clientHeight;
  var footer_w = document.getElementById("foot").clientWidth;
  console.log(">>footer: h=",footer_h,"w = ",footer_w);
}

function setkillkey(){
  document.addEventListener("keydown", function (event) {
    document.getElementById('keypressed').innerHTML = event.key;
     switch (event.key) {
      case ",":
        // console.log(event.key,0);
        update(0);
        break;
      case ".":
        // console.log(event.key,1);
        update(1);
        break;
      case "/":
      // console.log(event.key,2);
      update(2);
      break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }, true);
}


function getMonsterByScore(score){
  for(let i = currentMonsterIndex; i< scoreRange.length; i++){

    // console.log('i=', i,'score=',score, score - scoreRange[i], scoreRange[i+1] - score)
    if(score - scoreRange[i]>=0 && scoreRange[i+1] - score > 0)
    {
      // console.log(monsters[i])
      currentMonsterIndex = i;
      return i
    }
  }
}

async function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

async function update(i){
  console.log('updating')
    var latest_row = document.getElementById("box_"+ box_count);
    if(!latest_row){
      if(bossHealth>0)
      {
        console.log('attacking boss');
        attack('boss', currentAtk);
      }
      return;
    };

    var score_div = document.getElementById("score");
    if(parseInt(latest_row.getAttribute('name')) == i){
      attack('row',currentAtk);
      console.log(`killing box#${box_count}`);
      latest_row.parentElement.removeChild(latest_row);
      score++;
      score_div.innerHTML=score.toString();
      var remainMonsters = document.getElementsByClassName('wrapper_box');
      box_count++;

      if((score + remainMonsters.length) < scoreRange[scoreRange.length-1]){ //haven't reached max score limit
        addrow(getMonsterByScore(score));
      }
      if(score== scoreRange[scoreRange.length-1]){
        console.log('spawning boss')
        spawnBoss()
        await sleep(3000);
        console.log('spawned boss')
      }
    }
}

async function attack(who, number){
  var wa = document.createElement('div')
  wa.classList.add('wrap-atk-num');
  number.toString().split('').forEach(function(digit){
    var imageDigit = document.createElement('img');
    imageDigit.src = `./static/atk_${digit}.png`;
    wa.appendChild(imageDigit);
  })
  if(who == 'row'){
    var target = document.getElementById(`monster_${box_count}`);
  }
  else{
    hitBoss();
    bossHealth-=currentAtk;
    var target = document.getElementById(`boss`);
  }
  let targetRect = target.getBoundingClientRect();
  console.log(targetRect.x, targetRect.y)
  wa.style.position = 'fixed';
  wa.style.left = `${targetRect.x}px`;
  wa.style.top = who=='row'? `${targetRect.y-20}px` : `${targetRect.y+150}px`;
  let time = 1.5;
  document.documentElement.appendChild(wa);
  wa.style.animation = `fadeOut ${time}s forwards`;
  // console.log('attacked',target);
  await sleep(time*1000);
  wa.remove();
  console.log('removing wrap-atk_num');
  if(who=='boss' && bossHealth<0){
    console.log('killed boss!!!');
    target.classList.remove('boss-alive');
    target.classList.add('boss-died');
  }
}

async function spawnBoss(){
  var boss = document.getElementById('boss')
  boss.parentElement.style.display = 'block';
}

async function hitBoss(){
  var boss = document.getElementById('boss')
  boss.classList.remove('boss-alive');
  boss.classList.add('boss-kd');
  await sleep(2000);
  boss.classList.remove('boss-kd');
  boss.classList.add('boss-alive');
}