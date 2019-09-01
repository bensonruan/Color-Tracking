( function( factory ) {
    "use strict";
    if ( typeof define === "function" && define.amd ) {

        // AMD
        define( [ "jquery" ], factory );
    } else if ( typeof exports === "object" ) {

        // CommonJs
        factory( require( "jquery" ) );
    } else {

        // Browser globals
        factory( jQuery );
    }
}( function( $ ) {
    "use strict";
    $.fn.broiler = function( callBack ) {
        var image = this[0],
            canvas = $( "<canvas/>" )[0],
            imageData;
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext( "2d" ) .drawImage( image, 0, 0, image.width, image.height );
        imageData = canvas.getContext( "2d" ).getImageData( 0, 0, image.width, image.height ).data;
        this.click( function( event ) {
            var offset = $( this ).offset(), x, y, scrollLeft, scrollTop, start;
            scrollLeft = $( window ).scrollLeft();
            scrollTop = $( window ).scrollTop();
            x = Math.round( event.clientX - offset.left + scrollLeft );
            y = Math.round( event.clientY - offset.top + scrollTop );
            start = ( x + y * image.width ) * 4;
            callBack( {
                r: imageData[start],
                g: imageData[start + 1],
                b: imageData[start + 2],
                a: imageData[start + 3]
            } );
        } );
    };
} ) );
