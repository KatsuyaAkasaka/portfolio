/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
	*/ 
const w = $('#svgArea').width();
const h = w * 0.5;
const centerSVGX = 320;
const centerSVGY = 160;
let svg;
let simulation;
let nodeData = [];
let linkData = []; 
let node, link;
const nodeSize = 40;
const maxPow = 3;

function makeData() {
	const nodePath = [
		{
			'name':'icon',
			'pow': 2 }, 
		{
			'name':'js',
			'pow':5 },
		{
			'name':'nodejs',
			'pow':5 },
		{
			'name':'unity',
			'pow': 3 },
		{
			'name':'rails',
			'pow':1.5 },
		{
			'name':'cpp',
			'pow':2 },
		{
			'name': 'docker',
			'pow': 4
		}
	];
	nodePath.forEach((v,i) => {
		const nodeObj = {
			'id': i,
			'path': v.name,
			'pow' : v.pow,
			'size': nodeSize * v.pow / maxPow
		};
		nodeData.push(nodeObj);
	});
	nodeData.forEach(v => {
		if(v.id != 0) linkData.push({'source':0, 'target':v.id}); 
	});
}

function makeElement() {
	link = svg.selectAll("line")
		.data(linkData)
		.enter()
		.append("line")
		.attr('stroke', "#ccc")
		.attr("stroke-width", 1);

	node = svg.selectAll("circle")
		.data(nodeData)
		.enter()
		.append("image")
		.attr("xlink:href",d => {return `images/${d.path}.png`})
		.attr('width', d => {return d.size})
		.attr('height', d => {return d.size})
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	simulation = d3.forceSimulation()
		.force('link', d3.forceLink()
			.distance(100)
			.strength(0.01)
			.iterations(40))
		.force("collide", d3.forceCollide()
			.radius(function(d) { return d.r; })
			.strength(-100)
			.iterations(40))
		.force("charge", d3.forceManyBody())//.strength(-500))
	// .force("x", d3.forceX().strength(0.02).x(w / 2))
	// .force("y", d3.forceY().strength(0.02).y(h / 2))
		.force("center", d3.forceCenter(centerSVGX, centerSVGY));
}

function applyElement() {
	simulation
		.velocityDecay(0.2)
	simulation
		.nodes(nodeData)
		.on("tick", ticked);

	simulation.force("link")
		.links(linkData)
		.id(function(d) { return d.index; });
}


// 4. forceSimulation 描画更新用関数
function ticked() {
	node
		.attr('x', function(d) { return d.x - d.size/2; })
		.attr('y', function(d) { return d.y - d.size/2; });
	link
		.attr('x1', function(d) { return d.source.x; })
		.attr('y1', function(d) { return d.source.y; })
		.attr('x2', function(d) { return d.target.x; })
		.attr('y2', function(d) { return d.target.y; });
	const root = simulation.nodes()[0];
	root.fx = centerSVGX;
	root.fy = centerSVGY;
}

// 5. ドラッグ時のイベント関数
function dragstarted(d) {
	if(!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if(!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}


function createMap () {
	svg = d3.select("#svgArea");
	console.log(svg);

	makeData();

	makeElement();

	applyElement();
}

(function($) {
	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Nav.
	var $nav = $('#nav');

	if ($nav.length > 0) {

		// Shrink effect.
		$main
			.scrollex({
				mode: 'top',
				enter: function() {
					$nav.addClass('alt');
				},
				leave: function() {
					$nav.removeClass('alt');
				},
			});

		// Links.
		var $nav_a = $nav.find('a');

		$nav_a
			.scrolly({
				speed: 1000,
				offset: function() { return $nav.height(); }
			})
			.on('click', function() {

				var $this = $(this);

				// External link? Bail.
				if ($this.attr('href').charAt(0) != '#')
					return;

				// Deactivate all links.
				$nav_a
					.removeClass('active')
					.removeClass('active-locked');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
				$this
					.addClass('active')
					.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
				if ($section.length < 1)
					return;

				// Scrollex.
				$section.scrollex({
					mode: 'middle',
					initialize: function() {

						// Deactivate section.
						if (browser.canUse('transition'))
							$section.addClass('inactive');

					},
					enter: function() {

						// Activate section.
						$section.removeClass('inactive');

						// No locked links? Deactivate all links and activate this section's one.
						if ($nav_a.filter('.active-locked').length == 0) {

							$nav_a.removeClass('active');
							$this.addClass('active');

						}

						// Otherwise, if this section's link is the one that's locked, unlock it.
						else if ($this.hasClass('active-locked'))
							$this.removeClass('active-locked');

					}
				});

			});

	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000
	});
	//$("a[href=#]").click(function(){
	//});
	createMap();
	

})(jQuery);
