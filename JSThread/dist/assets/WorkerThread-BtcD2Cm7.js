(function(){"use strict";const t=class t{static async run(a){t.initData(a),await t.synchronized(async()=>{t.print("Acquired Key"),await new Promise(e=>setTimeout(()=>e(),1e3))}),t.end()}static async synchronized(a){t.request("key1"),await new Promise(e=>{self.onmessage=s=>{const[r,u]=[s.data.action,s.data.value];r==="give"&&u==="key1"&&e(),n(s)}}),await a(),t.release("key1")}static setData(a,e){t.data[a]=e,t.print(`Set ${a} to ${e}`)}static print(a){return self.postMessage({action:"print",value:a}),t}static end(){return self.postMessage({action:"end"}),t}static request(a){return self.postMessage({action:"request",value:a}),t}static release(a){return self.postMessage({action:"release",value:a}),t}};t.data={},t.initData=a=>{for(const[e,s]of Object.entries(a))t.setData(e,s)};let i=t;const n=o=>{const a=o.data;a.action==="start"&&i.run(a.data)};function c(){self.onmessage=n}c()})();
