class Slopegraph
  constructor: (opts = {}) ->
    color        = opts?.color       ? "#555"
    fonts        = opts?.font        ? "Hoefler Text, Palatino, Georgia, Serif"
    fontWeight   = opts?.fontWeight  ? "bold"
    @labelSize   = opts?.labelSize   ? 12
    @labelWidth  = opts?.labelWidth  ? 100
    @titleHeight = opts?.titleHeight ? 50
    @titleSize   = opts?.titleSize   ? 15
    @valMargin   = opts?.valMargin   ? 10
    @valWidth    = opts?.valWidth    ? 50
    @height      = opts?.height      ? null
    @width       = opts?.width       ? null
    @min         = opts?.min         ? null
    @max         = opts?.max         ? null

    @lineStyle = stroke: color

    @titleStyle  = font: "#{@titleSize}px #{fonts}", "font-weight": fontWeight, fill: color
    @titleStyleL = _.extend _.clone(@titleStyle), "text-anchor": "end"
    @titleStyleR = _.extend _.clone(@titleStyle), "text-anchor": "start"

    @labelStyle  = font: "#{@labelSize}px #{fonts}", "font-weight": fontWeight, fill: color
    @labelStyleL = _.extend _.clone(@labelStyle), "text-anchor": "end"
    @labelStyleR = _.extend _.clone(@labelStyle), "text-anchor": "start"

    # All label bounding boxes (x, y, width, height). We track this to avoid collisions between labels.
    @seenBoxes = []

  # Returns a bool indicating whether box1 and box2 overlap
  @collide: (box1, box2) -> box1.y + box1.h > box2.y > box1.y - box2.h && box1.x + box1.w > box2.x > box1.x - box2.w

  # Returns a bool indicating whether a box collides with any of the boxes in boxList
  @anyCollide: (box, boxList) -> !!_(boxList).detect((seen) -> Slopegraph.collide(box, seen))

  # Setters (all return @)
  setData: (@data) -> @
  setTitles: (@titles) -> @

  # Load graph data from a <table>
  # Returns @
  fromTable: ($table) ->
    # Throw away the first title because that's the title for the labels column
    @titles = _.rest($table.find("thead").find("th,td").map(-> $(@).html()))
    @data   = $table.find("tbody tr").map(-> $(@).find("td").map(-> $(@).html()))
    @

  # Draw the graph
  # $el should be a jQuery object for the DOM element to draw the graph in
  # Returns @
  draw: ($el) ->
    @width  ?= $el.width()
    @height ?= $el.height()

    @max ?= Math.ceil  _(@data).reduce(((max, line) -> Math.max(max, line[1], line[2])), 0)
    @min ?= Math.floor _(@data).reduce(((min, line) -> Math.min(min, line[1], line[2])), @max)

    # Label locations
    startLabelX = @labelWidth
    endLabelX   = @width - @labelWidth
    startValX   = startLabelX + @valWidth - @valMargin
    endValX     = endLabelX - @valWidth + @valMargin

    # Choose a scale for the graph
    scale = (@height - @titleHeight) / (@max - @min)

    # Clear the element that we will be drawing in
    $el.empty()

    @r = Raphael($el.get(0), @width, @height)

    # Titles
    @r.text(startValX, @titleSize / 2, _.first(@titles)).attr(@titleStyleL)
    @r.text(endValX, @titleSize / 2, _.last(@titles)).attr(@titleStyleR)

    # We push the labels down by this much to get them to better align with the lines
    @labelOffset = @labelSize / 4

    lines = _(@data).map (line) =>
      country:  line[0]
      startVal: line[1]
      endVal:   line[2]
      startY:   @height - scale * (line[1] - @min)
      endY:     @height - scale * (line[2] - @min)

    # Go through the start values in order from highest to lowest drawing the label text for each
    # This guarantees that the labels will be correctly ordered even if collisions occur
    for line in _(lines).sortBy((line) -> -line.startVal)
      line.startY = @drawLabel line.country, line.startVal, startLabelX, startValX, line.startY - @labelOffset, @labelStyleL

    # Now go through the end values in order from highest to lowest drawing the label text and the line for each
    for line in _(lines).sortBy((line) -> -line.endVal)
      line.endY = @drawLabel line.country, line.endVal, endLabelX, endValX, line.endY - @labelOffset, @labelStyleR
      @r.path("M#{startLabelX + @valWidth} #{line.startY}L#{endLabelX - @valWidth} #{line.endY}").attr(@lineStyle)
    @

  # Returns the Y co-ordinate of the label
  drawLabel: (label, val, labelX, valX, y, style) ->
    # If necessary, move the label down to avoid collisions with other labels
    labelBox = x: labelX, y: y, w: @labelWidth, h: @labelSize
    labelBox.y++ while Slopegraph.anyCollide(labelBox, @seenBoxes)
    y = labelBox.y

    # Add the new label boxes to the list of boxes that we must not collide with from now on
    @seenBoxes.push(labelBox)

    @r.text(labelX, y, label).attr(style)
    @r.text(valX,   y, val).attr(style)
    y


$(document).ready ->
  # Expose Slopegraph globally
  window.Slopegraph = Slopegraph

