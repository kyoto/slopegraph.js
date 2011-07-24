# Slopegraph.js

JavaScript library for generating Slopegraphs.

Based on [an article](http://charliepark.org/slopegraphs/) by Charlie Park and Kevin Mark's [JavaScript implementation](https://github.com/kevinmarks/slopegraph).

## Usage

    // Generate Slopegraph from the data in a <table>
    graph = new SlopeGraph().fromTable($("#slopegraph table")).draw($("#slopegraph"))

    // Generate Slopegraph from data passed in manually
    opts = {width: 400, height: 200, min: 100, max: 120};
    container = $("#slopegraph");
    graph = new Slopegraph(opts);
    graph.setTitles(["March", "April"])
         .setData([["London", 102, 114], ["Paris", 109, 117], ["Tokyo", 108, 112]])
         .draw(container);

For a full example see test/slopegraph.html.

## Setup

Requires Raphaël, jQuery and Underscore.js.

