let e=document.createElement("style");e.innerHTML="ul[data-v-3e07ced7]{cursor:pointer}.loading[data-v-3e07ced7]{width:75vw;height:400px;overflow-y:hidden;text-align:center;background:linear-gradient(-45deg,#6cbaa1,#697eff,#00b4db,#0083b0,#3e5ade);background-size:400%;animation:10s infinite Gradient-3e07ced7;-webkit-animation:10s infinite Gradient-3e07ced7}@keyframes Gradient-3e07ced7{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}",document.head.appendChild(e);import{i as t,c as a,s,t as i,d as o}from"./index.47871813.js";import{s as n,d as l,r,l as c,a as h}from"./exports_layers.d0bb66af.js";import{p as d,b as m,o as g,c as u,a as p,d as S,e as f,v as b,F as y,w}from"./index.371535d0.js";var k={data:()=>({loading:!1,showSecond:!1,stockName:"MSFT",windowSize:51,trainingSize:80,nLayers:4,nEpochs:20,learningRate:.01,closeData:[],smaDetail:[]}),methods:{getStockData(){this.loading=!0;let e=this.stockName;if(sessionStorage.getItem("curStockName")===e){let e=JSON.parse(sessionStorage.getItem("curStockData"));this.initChart(e)}else fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+e+"&outputsize=full&apikey=GC2VH1R4C2XEMVPA").then((e=>e.json())).then((t=>{sessionStorage.setItem("curStockName",e),sessionStorage.setItem("curStockData",JSON.stringify(t)),this.initChart(t)}))},initChart(e){var a=t(document.getElementById("math-chart"));let s=[],i=[],o=[];this.closeData=[],this.smaDetail=[];for(let[t,a]of Object.entries(e["Time Series (Daily)"]))s.push({time:t,open:Number(a["1. open"]),close:Number(a["4. close"]),high:Number(a["2. high"]),low:Number(a["3. low"]),volume:Number(a["5. volume"])});s=s.reverse();let n=this.windowSize,l=(n-1)/2;for(let e=0;e<s.length;e++){let t=s[e].close;s[e].smaDetail=[];for(let a=1;a<l+1;a++)t+=s[e+a]?s[e+a].close:s[e].close,t+=s[e-a]?s[e-a].close:s[e].close;for(let t=0;t<n;t++)s[e].smaDetail.push(s[e-l+t]?s[e-l+t].close:s[e].close);s[e].SMA=t/n}s.map(((e,t)=>{t>31&&t<s.length-30&&(i.push(e.time),o.push(e.SMA),this.smaDetail.push(e.smaDetail),this.closeData.push(e.close))})),this.loading=!1,this.showSecond=!0;let r=["#5470C6","#EE6666"];a.setOption({color:r,tooltip:{trigger:"none",axisPointer:{type:"cross"}},legend:{data:["实际收盘价","SMA收盘价"]},grid:{top:50,bottom:40,left:30},xAxis:[{type:"category",axisTick:{alignWithLabel:!0},axisLine:{onZero:!1,lineStyle:{color:r[1]}},axisPointer:{label:{formatter:function(e){return"SMA收盘价  "+e.value+(e.seriesData.length?"："+e.seriesData[0].data:"")}}},data:[...i]},{type:"category",axisTick:{alignWithLabel:!0},axisLine:{onZero:!1,lineStyle:{color:r[0]}},axisPointer:{label:{formatter:function(e){return"实际收盘价  "+e.value+(e.seriesData.length?"："+e.seriesData[0].data:"")}}},data:[...i]}],yAxis:[{type:"value"}],series:[{name:"实际收盘价",type:"line",xAxisIndex:1,smooth:!0,emphasis:{focus:"series"},data:[...this.closeData]},{name:"SMA收盘价",type:"line",smooth:!0,emphasis:{focus:"series"},data:[...o]}]})},startTrain(e,t){const d=this.windowSize,m=[10,5],g=this.windowSize;let u=t.slice(0,Math.floor(this.trainingSize/100*t.length)),p=e.slice(0,Math.floor(this.trainingSize/100*e.length));const S=a(u,[u.length,u[0].length]).div(s(10)),f=a(p,[p.length,1]).reshape([p.length,1]).div(s(10)),b=n();b.add(l({units:50,inputShape:[d]})),b.add(r({targetShape:m}));let y=[];for(let e=0;e<this.nLayers;e++)y.push(c({units:20}));b.add(h({cell:y,inputShape:m,returnSequences:!1})),b.add(l({units:1,inputShape:[20]})),b.compile({optimizer:i.adam(this.learningRate),loss:"meanSquaredError"}),b.fit(S,f,{batchSize:g,epochs:this.nEpochs,callbacks:o.show.fitCallbacks({name:"训练过程"},["loss"])}).then((()=>{let s=t.slice(e.length-1,e.length);console.log(s);const i=b.predict(a(s,[s.length,s[0].length])).mul(10);console.log("output",Array.from(i.dataSync()))}))}}};const v=w();d("data-v-3e07ced7");const x=p("h2",null,"RNN时间序列处理 - 股票预测（Micresoft）",-1),D=p("h3",null,"1）实际收盘价 与 SMA收盘价",-1),M={key:0,class:"loading"},A={id:"math-chart",style:{width:"75vw",height:"400px"}},N={key:1},z=p("h3",null,"2）通过SMA均线进行训练",-1);m();const E=v(((e,t,a,s,i,o)=>(g(),u(y,null,[x,D,p("button",{style:{"margin-bottom":"10px"},onClick:t[1]||(t[1]=e=>o.getStockData())},"获取数据"),i.loading?(g(),u("div",M)):S("",!0),f(p("div",A,null,512),[[b,!i.loading]]),i.showSecond?(g(),u("div",N,[z,p("button",{style:{"margin-bottom":"10px"},onClick:t[2]||(t[2]=e=>o.startTrain(i.closeData,i.smaDetail))},"开始训练")])):S("",!0)],64))));k.render=E,k.__scopeId="data-v-3e07ced7";export default k;