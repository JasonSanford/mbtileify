(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){function bind(fn,me){return function(){return fn.apply(me,arguments)}}module.exports={bind:bind}},{}],2:[function(require,module,exports){var utils=require("./utils");function App(){var me=this;this.drawCreated=utils.bind(this.drawCreated,this);this.drawStart=utils.bind(this.drawStart,this);this.drawDeleted=utils.bind(this.drawDeleted,this);this.alertIntro=document.querySelectorAll(".alert-intro")[0];this.map=new Map;this.featureGroup=L.featureGroup();this.featureGroup.addTo(this.map);this.drawControl=new DrawControl(this.featureGroup);this.drawControl.control.addTo(this.map);this.map.on("draw:created",this.drawCreated);this.map.on("draw:drawstart",this.drawStart);this.map.on("draw:deleted",this.drawDeleted)}App.prototype.drawStart=function(){this.alertIntro.style.display="none";this.clearCurrentFeature()};App.prototype.drawCreated=function(event){this.featureGroup.addLayer(event.layer)};App.prototype.drawDeleted=function(){this.alertIntro.style.display="block"};App.prototype.clearCurrentFeature=function(){this.featureGroup.clearLayers()};function Map(){L.mapbox.accessToken="pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6InRJMHZPZFUifQ.F4DMGoNgU3r2AWLY0Eni-w";var map=L.mapbox.map("map","jcsanford.kmdnbkib");return map}function DrawControl(featureGroup){this.control=new L.Control.Draw({edit:{featureGroup:featureGroup},draw:{polyline:false,polygon:false,circle:false,marker:false,rectangle:{shapeOptions:{color:"#333",fillColor:"#333",opacity:1,fillOpacity:.5,weight:2}}}})}new App},{"./utils":1}]},{},[2]);
