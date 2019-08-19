//  16px  的margin top
//   *
//  118px 的footer
//  window_height = 694 
// * = 694 - 134 / 63
var total_box = 0;
var box_num = 0; 
var score = 0;
var box_count = 1;
window.onload = ()=>{
  setkillkey();
  load_monster();
}
function load_monster(){
  console.log("Game initializing:...");
  var score_h = document.getElementById("score_bar").clientHeight;
  var footer_h = document.getElementById("foot").clientHeight;
  var window_height = window.innerHeight;
  var monster_height = 90;
  var row_count = parseInt((window_height-score_h-footer_h)/monster_height);
  total_box = row_count;
  console.log(`Add ${row_count} rows`);
  for(let i=0;i<row_count;i++){
    addrow();
  }
  console.log("Game initialized!");
}
function addrow(){
  box_num++;
  var base = document.getElementById("wrapper_out");
  var row = document.createElement("div");
  row.className="wrapper_box";
  row.id="box_"+box_num.toString();

  var debug = document.createElement('p');
  debug.innerHTML=box_num.toString()
  row.appendChild(debug);

  var windmonster = parseInt((Math.random()*10)%3);
  for (let i=0;i<3;i++){
    var row_item = document.createElement('img');
    row_item.className="item";
    if(i==windmonster){
      row_item.setAttribute('src','static/tenor.gif')
    }
    row.appendChild(row_item);
  }
  row.setAttribute('name',windmonster);
  //var old_box = document.getElementById("box_"+box_num);  
  base.insertBefore(row,base.childNodes[0]);
  console.log(`Added row (name=monster=${windmonster} box_num=${box_num})`);
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
        console.log(event.key,0);
        update(0);
        break;
      case ".":
        console.log(event.key,1);
        update(1);
        break;
      case "/":
      console.log(event.key,2);
      update(2);
      break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }, true);
}
function update(i){
    var latest_row = document.getElementById("box_"+ box_count);
    console.log("foundbox_"+box_count);
    console.log("last row name = ",parseInt(latest_row.getAttribute('name')));
    var score_div = document.getElementById("score");
    if(parseInt(latest_row.getAttribute('name')) == i){
      latest_row.parentElement.removeChild(latest_row);
      score++;
      score_div.innerHTML=score.toString();
      addrow();
      box_count++;
    }
}