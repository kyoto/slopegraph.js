(function() {
  var Slopegraph;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Slopegraph = (function() {
    function Slopegraph(opts) {
      var color, fontWeight, fonts, _ref, _ref10, _ref11, _ref12, _ref13, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (opts == null) {
        opts = {};
      }
      color = (_ref = opts != null ? opts.color : void 0) != null ? _ref : "#555";
      fonts = (_ref2 = opts != null ? opts.font : void 0) != null ? _ref2 : "Hoefler Text, Palatino, Georgia, Serif";
      fontWeight = (_ref3 = opts != null ? opts.fontWeight : void 0) != null ? _ref3 : "bold";
      this.labelSize = (_ref4 = opts != null ? opts.labelSize : void 0) != null ? _ref4 : 12;
      this.labelWidth = (_ref5 = opts != null ? opts.labelWidth : void 0) != null ? _ref5 : 100;
      this.titleHeight = (_ref6 = opts != null ? opts.titleHeight : void 0) != null ? _ref6 : 50;
      this.titleSize = (_ref7 = opts != null ? opts.titleSize : void 0) != null ? _ref7 : 15;
      this.valMargin = (_ref8 = opts != null ? opts.valMargin : void 0) != null ? _ref8 : 10;
      this.valWidth = (_ref9 = opts != null ? opts.valWidth : void 0) != null ? _ref9 : 50;
      this.height = (_ref10 = opts != null ? opts.height : void 0) != null ? _ref10 : null;
      this.width = (_ref11 = opts != null ? opts.width : void 0) != null ? _ref11 : null;
      this.min = (_ref12 = opts != null ? opts.min : void 0) != null ? _ref12 : null;
      this.max = (_ref13 = opts != null ? opts.max : void 0) != null ? _ref13 : null;
      this.lineStyle = {
        stroke: color
      };
      this.titleStyle = {
        font: "" + this.titleSize + "px " + fonts,
        "font-weight": fontWeight,
        fill: color
      };
      this.titleStyleL = _.extend(_.clone(this.titleStyle), {
        "text-anchor": "end"
      });
      this.titleStyleR = _.extend(_.clone(this.titleStyle), {
        "text-anchor": "start"
      });
      this.labelStyle = {
        font: "" + this.labelSize + "px " + fonts,
        "font-weight": fontWeight,
        fill: color
      };
      this.labelStyleL = _.extend(_.clone(this.labelStyle), {
        "text-anchor": "end"
      });
      this.labelStyleR = _.extend(_.clone(this.labelStyle), {
        "text-anchor": "start"
      });
      this.seenBoxes = [];
    }
    Slopegraph.collide = function(box1, box2) {
      var _ref, _ref2;
      return (box1.y + box1.h > (_ref = box2.y) && _ref > box1.y - box2.h) && (box1.x + box1.w > (_ref2 = box2.x) && _ref2 > box1.x - box2.w);
    };
    Slopegraph.anyCollide = function(box, boxList) {
      return !!_(boxList).detect(function(seen) {
        return Slopegraph.collide(box, seen);
      });
    };
    Slopegraph.prototype.setData = function(data) {
      this.data = data;
      return this;
    };
    Slopegraph.prototype.setTitles = function(titles) {
      this.titles = titles;
      return this;
    };
    Slopegraph.prototype.fromTable = function($table) {
      this.titles = _.rest($table.find("thead").find("th,td").map(function() {
        return $(this).html();
      }));
      this.data = $table.find("tbody tr").map(function() {
        return $(this).find("td").map(function() {
          return $(this).html();
        });
      });
      return this;
    };
    Slopegraph.prototype.draw = function($el) {
      var endLabelX, endValX, line, lines, scale, startLabelX, startValX, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
            if ((_ref = this.width) != null) {
        _ref;
      } else {
        this.width = $el.width();
      };
            if ((_ref2 = this.height) != null) {
        _ref2;
      } else {
        this.height = $el.height();
      };
            if ((_ref3 = this.max) != null) {
        _ref3;
      } else {
        this.max = Math.ceil(_(this.data).reduce((function(max, line) {
          return Math.max(max, line[1], line[2]);
        }), 0));
      };
            if ((_ref4 = this.min) != null) {
        _ref4;
      } else {
        this.min = Math.floor(_(this.data).reduce((function(min, line) {
          return Math.min(min, line[1], line[2]);
        }), this.max));
      };
      startLabelX = this.labelWidth;
      endLabelX = this.width - this.labelWidth;
      startValX = startLabelX + this.valWidth - this.valMargin;
      endValX = endLabelX - this.valWidth + this.valMargin;
      scale = (this.height - this.titleHeight) / (this.max - this.min);
      $el.empty();
      this.r = Raphael($el.get(0), this.width, this.height);
      this.r.text(startValX, this.titleSize / 2, _.first(this.titles)).attr(this.titleStyleL);
      this.r.text(endValX, this.titleSize / 2, _.last(this.titles)).attr(this.titleStyleR);
      this.labelOffset = this.labelSize / 4;
      lines = _(this.data).map(__bind(function(line) {
        return {
          country: line[0],
          startVal: line[1],
          endVal: line[2],
          startY: this.height - scale * (line[1] - this.min),
          endY: this.height - scale * (line[2] - this.min)
        };
      }, this));
      _ref5 = _(lines).sortBy(function(line) {
        return -line.startVal;
      });
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        line = _ref5[_i];
        line.startY = this.drawLabel(line.country, line.startVal, startLabelX, startValX, line.startY - this.labelOffset, this.labelStyleL);
      }
      _ref6 = _(lines).sortBy(function(line) {
        return -line.endVal;
      });
      for (_j = 0, _len2 = _ref6.length; _j < _len2; _j++) {
        line = _ref6[_j];
        line.endY = this.drawLabel(line.country, line.endVal, endLabelX, endValX, line.endY - this.labelOffset, this.labelStyleR);
        this.r.path("M" + (startLabelX + this.valWidth) + " " + line.startY + "L" + (endLabelX - this.valWidth) + " " + line.endY).attr(this.lineStyle);
      }
      return this;
    };
    Slopegraph.prototype.drawLabel = function(label, val, labelX, valX, y, style) {
      var labelBox;
      labelBox = {
        x: labelX,
        y: y,
        w: this.labelWidth,
        h: this.labelSize
      };
      while (Slopegraph.anyCollide(labelBox, this.seenBoxes)) {
        labelBox.y++;
      }
      y = labelBox.y;
      this.seenBoxes.push(labelBox);
      this.r.text(labelX, y, label).attr(style);
      this.r.text(valX, y, val).attr(style);
      return y;
    };
    return Slopegraph;
  })();
  $(document).ready(function() {
    return window.Slopegraph = Slopegraph;
  });
}).call(this);
