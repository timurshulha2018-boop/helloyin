// ===== Онлайн-сеть через PeerJS (без сервера, прямо на GitHub Pages) =====
const Net = {
  peer:null, conn:null, isHost:false, myId:'', room:'',
  onData:null, onOpen:null, onClose:null,
  host(room){
    this.isHost=true; this.room='hw-'+room;
    this.peer=new Peer(this.room,{host:CONFIG.peerHost,secure:true});
    this.peer.on('open',id=>{this.myId=id; this.onOpen&&this.onOpen('host',room);});
    this.peer.on('connection',c=>{this.conn=c; this.bind();});
    this.peer.on('error',e=>{if(e.type==='unavailable-id') alert('Комната занята! Придумай другой код.');});
  },
  join(room){
    this.isHost=false; this.room='hw-'+room;
    this.peer=new Peer({host:CONFIG.peerHost,secure:true});
    this.peer.on('open',id=>{this.myId=id;
      this.conn=this.peer.connect(this.room,{reliable:true}); this.bind();
      setTimeout(()=>{if(!this.conn||!this.conn.open){alert('Комната не найдена! Проверь код.');}},4000);
    });
  },
  bind(){
    this.conn.on('open',()=>this.onOpen&&this.onOpen('join',this.room));
    this.conn.on('data',d=>this.onData&&this.onData(d));
    this.conn.on('close',()=>this.onClose&&this.onClose());
  },
  send(d){ if(this.conn&&this.conn.open) this.conn.send(d); }
};
