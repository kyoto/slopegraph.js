# Slopegraph.js

JavaScript library for generating Slopegraphs.

Based on [an article](http://charliepark.org/slopegraphs/) by Charlie Park and Kevin Marks' [JavaScript implementation](https://github.com/kevinmarks/slopegraph).

## Usage

Generate Slopegraph from data in a \<table\>:

    graph = new SlopeGraph().fromTable($("#slopegraph table")).draw($("#slopegraph"));

Generate Slopegraph from data passed in manually:

    opts = {width: 400, height: 200, min: 100, max: 120};
    container = $("#slopegraph");
    graph = new Slopegraph(opts);
    graph.setTitles(["March", "April"])
         .setData([["London", 102, 114], ["Paris", 109, 117], ["Tokyo", 108, 112]])
         .draw(container);

For a full example see test/slopegraph.html.

## Setup

Requires Raphaël, jQuery and Underscore.js.

## License

### The MIT License (MIT)

Copyright (c) 2012 Andrew Pickering, andypickering.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.