class Module {

  constructor(board, parentElem, socket){
    board["alt"] = false;

    this.$state = {};
    this.$board = board;
    this.$parent = parentElem;
    this.$socket = socket;
    
    this.render();
    this.$el.appendTo(this.$parent);
  }

  onClick(e) {
    e.preventDefault();
  }

  updateState(data) {
    this.$state = data;
  }

  disable(){
    this.$el.addClass('disabled');
  }

  enable(){
    this.$el.removeClass('disabled');
  }

  render(){
    this.$el = $( "<div/>", { id: `${this.$board.id}` });
    if (this.$board.status === "offline") this.$el.addClass('disabled');
    $("<span/>", { 
      "class": "name",
      "text": `${this.$board.name}`,
    }).appendTo(this.$el);
  }
}

class Sensor extends Module {

  constructor(board, parentElem, socket){
    super(board, parentElem, socket);
    this.$el.on('click', this.onClick.bind(this));
  }

  onClick(e) {
    super.onClick(e);
    if (this.$board.status === "offline") return;
    this.$board.alt = !this.$board.alt;
    this.$el.toggleClass('alt');
  }

  updateState(data) {
    super.updateState(data);
    let $data = this.$el.find(".data");
    let text = "";
  
    switch (this.$state.type) {

      case 'dht':
        text = this.$state.temperature.substr(0,4);
        break;
      
      case 'caudal':
        if (this.$board.alt) {
          let idx = data.vol.indexOf(".");
          text = data.vol.substr(0,idx+2);
        }
        else {
          let idx = data.lph.indexOf(".");
          text = data.lph.substr(0,idx)
        }
        break;
    }

    $data.text(text);
  }
  render(){
    super.render();

    $("<span/>", { 
      "class": "data",
      "text": "",
    }).appendTo(this.$el);

    this.$el.addClass('sensor');
    this.$el.addClass(this.$board.actuator);
  }
}

class Actuator extends Module {

  constructor(board, parentElem, socket){
    super(board, parentElem, socket);
    this.$el.on('click', this.onClick.bind(this));
  }

  onClick(e) {
    super.onClick(e);
    if (this.$board.status === "offline") return;
    let action = this.$el.hasClass('on') ? 'off' : 'on';
    this.$el.toggleClass('on');
    this.$socket.emit(`console:boards:actuate`, { id: this.$board.id, action });
  }

  updateState(data) {
    super.updateState(data);
    let $data = this.$el.find(".data");
    $data.toggleClass('on', data.state === 'on');
  }

  render(){
    super.render();
    this.$el.addClass('actuator');
    this.$el.addClass(this.$board.actuator);
  }
}

class Dashboard {

  constructor(){
    this.$socket = io();
    
    this.$socket.on("connect", this.onConnect.bind(this));
    this.$socket.on("disconnect", this.onDisconnect.bind(this));

    this.$socket.on("console:boards:list", this.loadBoards.bind(this));
    this.$socket.on("console:boards:new", this.addBoard.bind(this));
    this.$socket.on("console:boards:disable", this.disableBoard.bind(this))
    this.$socket.on("console:boards:enable", this.enableBoard.bind(this))
    this.$socket.on("console:boards:data", this.updateBoardState.bind(this))

    this.$el = $("#controls");
    this.boards = [];
    this.serverStatus = "offline";
  };

  onConnect(){
    this.clearModules();
    this.serverStatus = "online";
    this.$socket.emit('console:register', {
      id: "someuniqueidprobablylogintoken",
      name: "Daniel"
    });
    this.$socket.emit('console:boards:get');
  }

  onDisconnect(){
    this.serverStatus = "offline"
  }

  disableBoard(id) {
    let idx = this.boards.findIndex( b => b.$board.id === id);
    if (idx !== -1) this.boards[idx].disable();
  }

  enableBoard(id) {
    let idx = this.boards.findIndex( b => b.$board.id === id);
    if (idx !== -1) this.boards[idx].enable();
  }

  updateBoardState(data) {
    let idx = this.boards.findIndex( b => b.$board.id === data.id);
    if (idx !== -1) this.boards[idx].updateState(data);
  }

  clearModules () {
    this.$el.empty();
  }

  loadBoards(board){
    board.forEach( this.addBoard.bind(this) );
  }

  addBoard (board) {
    let allowedSensors = ['dht', 'caudal', 'filter'];
    let idx = allowedSensors.findIndex( a => a === board.actuator);

    if (idx !== -1) this.addSensor(board);
    else this.addActuator(board);
  }

  addSensor(board) {
    let idx = this.boards.findIndex( b => b.$board.id === board.id);
    let sensor = new Sensor(board, this.$el, this.$socket);

     //we find an existing sensor with that id. Need to recreate in that very spot
    if (idx !== -1) this.boards.splice(idx,1,sensor);
    else this.boards.push(sensor); //else we just add at the end
  }

  addActuator(board) {
    let idx = this.boards.findIndex( b => b.$board.id === board.id);
    let actuator = new Actuator(board, this.$el, this.$socket);

    //we find an existing actuator with that id. Need to recreate in that very spot
    if (idx !== -1) this.boards.splice(idx,1,actuator);
    else this.boards.push(actuator); //else we just add at the end
  }
}

$(document).ready(function(){
  let dash = new Dashboard();
})