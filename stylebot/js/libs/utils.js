/**
  * General JavaScript utility methods used in stylebot
  *
  * Copyright (c) 2010 Ankit Ahuja
  * Dual licensed under GPL and MIT licenses.
  **/

var Utils = {
    
    // return array index at which property pName is equal to value 'pValue'
    search: function(arr, pName, pValue) {
        var len = arr.length;
        for(var i=0; i<len; i++)
        {
            if(arr[i][pName] == pValue)
                return i;
        }
        return null;
    },
    
    // if any of the passed keys is pressed, returns false.
    // Accepts a keys array and 'keyup' event object as arguments.
    // TODO: Add support for keydown, keypress events and alphanumeric keys
    filterKeys: function(keys, e) {
        if(typeof(e.keyCode) == 'undefined')
            return true;
        var len = keys.length;
        var keyCodes = {
            'ctrl': 17,
            'shift': 16,
            'tab': 9,
            'esc': 27,
            'enter': 13,
            'caps': 20,
            'option': 18,
            'backspace': 8,
            'left': 37,
            'top': 38,
            'right': 39,
            'bottom': 40,
            'arrowkeys':[ 37, 38, 39, 40 ],
        }
        for(var i=0; i<len; i++){
            var code = keyCodes[keys[i]];
            if(code.length > 1) // it is an array
            {
                if($.inArray(e.keyCode, code) != -1)
                    return false;
            }
            else
            {
                if(e.keyCode == code)
                    return false;
            }
        }
        return true;
    },
    
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    makeEditable: function(el, callback) {
        el.attr( 'title', 'click to edit' );

        el.bind( 'click keyup', { callback: callback }, function(e) {
            if( e.type == 'keyup' && e.keyCode != 13 )
                return true;

            var el = $( this );
            el.hide();
            var elWidth = el.width();
            var parentWidth = el.parent().width();
            if( elWidth > parentWidth )
                elWidth = parentWidth - 10;
            var value = el.html();
            
            // create a textfield
            var input = $('<input>', {
                type: 'text',
                class: 'stylebot-textfield',
                length: 10,
                value: value,
                id: 'stylebot-editing-field'
            })
            .css( 'min-width', elWidth );
            
            el.before( input );
            input.focus();
            
            var onClose = function(e) {
                if( e.type == "keyup" && e.keyCode != 13 && e.keyCode !=27 )
                    return true;
                if( e.type == "mousedown" && e.target.id == e.data.input.attr('id') )
                    return true;
                var value = e.data.input.attr( 'value' );
                e.data.input.remove();
                if( value == "" )
                    value = e.data.el.html();
                e.data.el.html( value );
                e.data.el.show();
                e.data.callback( value );
                $( document ).unbind( "mousedown", onClose );
                $( document ).unbind( "keyup", onClose );
            }
            
            input.bind( 'keyup', { input: input, el: el, callback: callback }, onClose );
            $( document ).bind( 'mousedown', { input: input, el: el, callback: callback }, onClose );
        });
    }
}