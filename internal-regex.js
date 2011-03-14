function InternalRegexSearch() {
    this.parent = Search;
    this.parent('internalRegex',
            // ********************
            // searchFunction
            // ********************
            function(message) {
                var list = ['a' + message, 'b' + message, 'c' + message];
                return list;
            },
            // ********************
            // resetFunction
            // ********************
            function() {
            },
            // ********************
            // updateDisplayFunction
            // ********************
            function() {
            },
            // ********************
            // drawFunction
            // ********************
            function(div) {
                var content = '';
                content += '<div><label name="internal-regex-common-only" >All Words And Phrases</label><input type="radio" name="internal-regex-search-type" /></div>';
                content += '<div><label name="internal-regex-common-only" >Common Words And Phrases</label><input type="radio" name="internal-regex-search-type" /></div>';
                content += '<div><label name="internal-regex-common-only" >Common Words Only</label><input type="radio" name="internal-regex-search-type" /></div>';
                div.innerHTML = content;
            },
            // ********************
            // hotKeyMappings
            // ********************
            {}
    );
}
