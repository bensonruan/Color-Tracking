const img = document.getElementById('selected-image');
const slider = document.getElementById("tolerance");
const tooltips = document.querySelectorAll('.tooltip span');
let regColors = ['magenta', 'cyan', 'yellow'];

window.onmousemove = function (e) {
    var x = (e.clientX + 20) + 'px',
        y = (e.clientY + 20) + 'px';
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = y;
        tooltips[i].style.left = x;
    }
};

$( document ).ready(function() {
    displayColorList(regColors,'color-list');
    //set up color picker
    var container = document.querySelector('#color-picker'),
    picker = new CP(container, false, container);
    picker.self.classList.add('static');
    picker.enter();
    picker.on("change", function(color) {
        $('#color-picker-selected').css({backgroundColor : '#' + color});
    });
});

$(window).on("load", function() {
    $("#selected-image").broiler(function(color) {
        var rgbColor = "rgb("+color.r+", "+color.g+", "+color.b+")"; 
        $('#color-picker-selected').css({backgroundColor : rgbColor});
    });
    $("#track-button").trigger( "click" );
});

$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
    if($( ".rect" ).length){
        $( ".rect" ).remove();
    }
    $("#track-button").prop('disabled', false);  
}); 

$("#selected-image").on("load", function () {
    $("#selected-image").broiler(function(color) {
        var rgbColor = "rgb("+color.r+", "+color.g+", "+color.b+")"; 
        $('#color-picker-selected').css({backgroundColor : rgbColor});
    });
});

$("#add-color-button").click(async function () {    
    var color = $('#color-picker-selected').css( "background-color" );
    regColors.push(color);
    var t = slider.value;
    tracking.ColorTracker.registerColor(color, function(r, g, b) {
        return getColorDistance(getRGB(color), {r: r, g: g, b: b}) < t
    });
    displayColorList(regColors, 'color-list')
});

$(document).on("click", ".color-box-delete" , function() {
    var cbox = $(this).parent();
    regColors = regColors.filter(function(ele){
        return ele != cbox.attr('name');
    });
    displayColorList(regColors, 'color-list', true);
});

$("#track-button").click(async function () {
    if($( ".rect" ).length){
        $( ".rect" ).remove();
    }
    var tracker = new tracking.ColorTracker(regColors);
    tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
            drawRect(rect.x, rect.y, rect.width, rect.height, rect.color);
        });
    });
    tracking.track('#selected-image', tracker);
});

$("#clear-button").click(async function () {
    if($( ".rect" ).length){
        $( ".rect" ).remove();
    }
});

function drawRect(x, y, w, h, color){
    var rect = $('<div></div>');   
    rect.addClass('rect');
    rect.css({ 
        border : '2px solid ' + color,
        width : w + 'px',
        height : h + 'px',
        left : (img.offsetLeft + x) + 'px',
        top : (img.offsetTop + y) + 'px'
    });
    $('#image-container').append(rect);
}

function getColorDistance(target, actual) {
    return Math.sqrt(
      (target.r - actual.r) * (target.r - actual.r) +
      (target.g - actual.g) * (target.g - actual.g) +
      (target.b - actual.b) * (target.b - actual.b)
    );
}

function displayColorList(colors, target, deletable){
    $('#'+target).empty();
    $.each(colors, function( index, color ) {
        var cbox = $('<div name="'+color+'"></div>');   
        cbox.addClass('color-box');
        cbox.css({ 
            background : color,
        });
        var dbtn =$('<button>X</button>');
        dbtn.addClass('color-box-delete');
        cbox.append(dbtn);
        $('#'+target).append(cbox);
    });
}

function getRGB(str){
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
      r: match[1],
      g: match[2],
      b: match[3]
    } : {};
  }