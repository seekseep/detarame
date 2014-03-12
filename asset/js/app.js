// window.onbeforeunload = function(){
// 	return "ページを移動しようとしています。";
// }
// ================================================

$(document).ready(function(){
	//	makeTestData();

	getBingoStatus();

	updateBingoStatus();
});

// ================================================

// 未出のボール
var bingoBox 	= [];

// 既出のボール
var bingoBoard 	= [];

// bingoBoxの状態
// 		- free 	中にボールがあり回転していない
//		- busy	中にボールが有り回転している
//		- empty	中にボールがない
var bingoBoxStatus 	= 'free';

// アプリの表示状態
//		- box 		プレイ画面である
//		- board 	ボード
//		- bingoCall ビンゴコール
//		- lizhiCall	リーチコール
var appViewStatus = 'box';

// コントローラーの表示状態
//		- visible	表示
//		- hidden	非表示
var appContorollerViewStatus = 'visible';	

// 回転タイマー
var bingoBoxTimer = undefined;
	
// 数値確定前に表示する回数
var bingoBoxTimeDefault = 20;
var bingoBoxTime 		= bingoBoxTimeDefault;


// ================================================

// テストデータの作成
function makeTestData(){

	var testBingoBox 	= [];
	var testBingoBoard 	= [];

	for(var i = 1; i <= 75; i++){
		testBingoBox.push(i);
	}

	for(var i = 0; i < 10; i++){
		var r = Math.floor(Math.random() * testBingoBox.length) - 1;
		var n = testBingoBoard.push(testBingoBox.splice(r,1)[0]);		
	}

	// cookieに保存
	$.cookie('bingoBox', JSON.stringify(testBingoBox));
	$.cookie('bingoBoard', JSON.stringify(testBingoBoard));


	console.log($.cookie('bingoBox'));
	console.log($.cookie('bingoBoard'));

	// cookieから取得
	getBingoStatus();
}

// ================================================

function resetBingo(){
	var res = window.confirm('リセットしてもよろしいですか？');

	if(res){
		initBingo();
		setBingoStatus();
	}
}

function initBingo(){

	console.log(bingoBoard);
	console.log(bingoBox);

	bingoBoard 	= [];
	bingoBox 	= [];

	for(var i = 1; i <= 75; i++){
		bingoBox.push(i);
	}

	$('#history .inner').empty();

	$('#board .bingo-ball')
		.addClass('uncalled');

	changePortNumber('');

	return true;
}

function updateBingoStatus(){
	updateBingoBoard();
	updateBingoBoxHistory();
}

function updateBingoBoard(){
	for(var n in bingoBoard){
		var number = bingoBoard[n];

		addBingoBoard(number);
	}

	if(bingoBoard.length > 0){
		var number = bingoBoard[bingoBoard.length-1];
		changePortNumber(number);
	}

	return;
}

function updateBingoBoxHistory(){

	$('#history > .inner').empty();

	for(var n in bingoBoard){
		var number = bingoBoard[n];

		addBingoBoxHistory(number);
	}

	return;
}

// ================================================

// ボックス内のボールのIdを取得する
function getFreeBingoBallId(){

	// 添字の取得
	var id = Math.floor(Math.random() * (bingoBox.length - 1));

	console.log('getFreeBingoBallId', id);

	return id;
}

function getBingoBallNumber(id){

	var number = bingoBox[id];
	console.log('getBingoBallNumber', number);

	return number;
}

// 指定されたIDを移動させる
function moveBingoBall(id){

	var number = bingoBox.splice(id, 1)[0];

	bingoBoard.push(number);

	return number;
}

// cookie に ビンゴの状態を保存する
function setBingoStatus(){
	$.cookie('bingoBox', JSON.stringify(bingoBox));
	$.cookie('bingoBoard', JSON.stringify(bingoBoard));

	console.log('success to inherit the status of bingo');
}

// cookie から ビンゴの状態を取得する
function getBingoStatus(){

	if($.cookie('bingoBox') && $.cookie('bingoBoard')){
		bingoBox 	= JSON.parse($.cookie('bingoBox'));
		bingoBoard	= JSON.parse($.cookie('bingoBoard'));
	}else{
		initBingo();
	}
}

// ================================================

function changePortNumber(number){

	$('#port_number')
		.removeClass('col-1')
		.removeClass('col-2')
		.removeClass('col-3')
		.removeClass('col-4')
		.removeClass('col-5')
		.attr({
			'data-number' : number
		})
		.addClass('col-' + Math.ceil(number / 15));

	if(Math.ceil(number / 15) == NaN){
		console.log(number,Math.ceil(number / 15));		
	}

	return true;
}

// ================================================

function addBingoBall(number){
	addBingoBoard(number);
	addBingoBoxHistory(number);

	return number;
}

function addBingoBoard(number){
	var selector = '.bingo-ball[data-number=' + number + ']';

	$(selector).removeClass('uncalled');

	return number;
}

function addBingoBoxHistory(number){

	if(!(Math.ceil(number / 15) > 0 && Math.ceil(number / 15) < 6)){
		
		console.log(number);

		initBingo();

	}else{
		$("<div>")
			.addClass('bingo-ball')
			.attr({
				'data-number' : number
			})
			.addClass('col-' + Math.ceil(number / 15))
			.prependTo('#history > .inner');	

		return number;		
	}

}

// ================================================

function startTurnBingoBox(){

	console.log('startTurnBingoBox');

	$('#port_number').removeClass('fixed');

	if(bingoBoxTimer){
		return false;
	}else{
		turnBingoBox();

		return false;
	}
}

function turnBingoBox(){

	var id 		= getFreeBingoBallId();

	var number 	=  bingoBox[id]; 

	changePortNumber(number);

	if(bingoBoxTime > 0){

		bingoBoxTime--;

		var sec = (bingoBoxTimeDefault - bingoBoxTime) * 10;

		bingoBoxTimer = setTimeout(turnBingoBox, sec);

	}else{

		bingoBoxTime = bingoBoxTimeDefault;

		fixBoardNumber(id);

		bingoBoxTimer = undefined;

	}

}

function fixBoardNumber(id){

	var number = getBingoBallNumber(id);

	changePortNumber(number);
	$('#port_number').addClass('fixed');

	moveBingoBall(id);
	addBingoBall(number);

	setBingoStatus();
}


// ================================================
function changeView(viewName){

	$("#app")
		.removeClass('box_view')
		.removeClass('board_view')
		.removeClass('prize_view')
		.removeClass('bingo_call_view')
		.removeClass('lizhi_call_view');

	if(viewName == 'box'){

		$("#app").addClass('box_view');
		appViewStatus = viewName;

		return;
	}

	if(viewName == 'board'){

		$("#app").addClass('board_view');
		appViewStatus = viewName;

		return;
	}

	if(viewName == 'prize'){

		$("#app").addClass('prize_view');
		appViewStatus = viewName;

		return;
	}

	if(viewName == 'bingoCall'){

		$("#app").addClass('bingo_call_view');
		appViewStatus = viewName;

		return;
	}

	if(viewName == 'lizhiCall'){

		$("#app").addClass('lizhi_call_view');
		appViewStatus = viewName;

		return;
	}

}

function changeBoxView(){
	changeView('box');

	return;
}

function changeBoardView(){
	changeView('board');
	hiddenController();
	return;
}

function changePrizeView(){
	changeView('prize');
	hiddenController();
	return;
}

function changeBingoCallView(){
	changeView('bingoCall');

	return;
}

function changeLizhiCallView(){
	changeView('lizhiCall');

	return;
}

function switchControllerView(){
	if($('#controller').hasClass('view')){
		$('#controller')
			.removeClass('view')
			.addClass('hidden');
	}else{
		$('#controller')
			.removeClass('hidden')
			.addClass('view');
	}
}

function hiddenController(){
		$('#controller')
			.removeClass('view')
			.addClass('hidden');	
}

// ================================================
// キーボードからの操作	

$(window).keydown(function(e){

	// delete backspace
	if(e.keyCode == 8){
		console.log('del/backspace');
		return false;
	}

	// 0
	if(e.keyCode == 48){
		console.log('0');
		return false;
	}

	// 1
	if(e.keyCode == 49){
		console.log('1');
		return false;
	}

	// 2
	if(e.keyCode == 50){
		console.log('2');
		return false;
	}

	// 3
	if(e.keyCode == 51){
		console.log('3');
		return false;
	}

	// 4
	if(e.keyCode == 52){
		console.log('4');
		return false;
	}

	// 5
	if(e.keyCode == 53){
		console.log('5');
		return false;
	}

	// 6
	if(e.keyCode == 54){
		console.log('6');
		return false;
	}

	// 7
	if(e.keyCode == 55){
		console.log('7');
		return false;
	}

	// 8
	if(e.keyCode == 56){
		console.log('8');
		return false;
	}

	// 9
	if(e.keyCode == 57){
		console.log('9');
		return false;
	}

	// esc キー
	if(e.keyCode == 27){
		resetBingo();
		return false;
	}

	// alt キー 
	if(e.keyCode == 18){
		switchControllerView();
		return false;
	}

	// space キー 
	if(e.keyCode == 32){
		
		if(appViewStatus == 'box'){
			startTurnBingoBox();
		}else{
			changeBoxView();
		}

		return true;
	}

	// Enter
	if(e.keyCode == 13){
		console.log('enter');
		return false;
	}

	// tab
	if(e.keyCode == 9){
		console.log('tab');
		return false;
	}

	// left
	if(e.keyCode == 37){
		if(appViewStatus == 'board'){
			changeBoxView();
		}

		return false;
	}

	// right
	if(e.keyCode == 39){

		if(appViewStatus == 'box'){
			changeBoardView();
		}

		return false;
	}

	// up
	if(e.keyCode == 38){
		if(appViewStatus == 'box'){
			changePrizeView();
		}else if(appViewStatus == 'board'){
			changeBoxView();
		}
		return false;
	}

	// down
	if(e.keyCode == 40){
		if(appViewStatus == 'prize'){
			changeBoxView();
		}
		return false;
	}

	console.log(e.keyCode);
});

// ================================================
// マウスからの操作
$(document).ready(function(){

	$('#controller .button').click(function(){
		console.log($(this));
		switchControllerView();
	})

	$('.prize-unit').click(function(){

		if($(this).hasClass('called')){
			$(this)
				.removeClass('called')
				.addClass('uncalled');
		}else{
			$(this)
				.removeClass('uncalled')
				.addClass('called');
		}

	})
})
