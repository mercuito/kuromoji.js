/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var zlib = require("zlibjs/bin/gunzip.min.js");
var DictionaryLoader = require("./DictionaryLoader");

/**
 * CustomDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
 * @param {string} dic_path Dictionary path
 * @constructor
 */
function CustomDictionaryLoader(dic_path, fileDataProvider) {
    if(!fileDataProvider){
        throw "Must provide a fileDataProvider as second argument"
    }
    DictionaryLoader.apply(this, [dic_path]);
    this.fileDataProvider = fileDataProvider;
    this.loadArrayBuffer = this.loadArrayBuffer.bind(this);
}

CustomDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);

/**
 * Utility function to load gzipped dictionary
 * @param {string} url Dictionary URL
 * @param {CustomDictionaryLoader~onLoad} callback Callback function
 */
CustomDictionaryLoader.prototype.loadArrayBuffer = function (url, callback) {
    var p = this.fileDataProvider(url).then(data => {
        var arraybuffer = data;
        var gz = new zlib.Zlib.Gunzip(new Uint8Array(arraybuffer));
        var typed_array = gz.decompress();
        callback(null, typed_array.buffer);
    }).catch(err=>{
        callback(err, null);
    });
};

/**
 * Callback
 * @callback CustomDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */

module.exports = CustomDictionaryLoader;
