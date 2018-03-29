!function () {
    var $ = jQuery;
    var textBox = $('#fetch-code');
    new flyBox.PlaceHolder(textBox);

    $('#fetch-block').on('submit', function () {
        var key = textBox.val().replace(/(^\s+)|(\s+$)/g, '');
        if (/^(\d|\w){6,20}$/.test(key) && /\d/.test(key) && /\w/.test(key))
            $(this).$('a:first').trigger('click');
        else
            $(this).$('a:last').trigger('click');
        return false;
    });

    $('#fetch-button').click(function () {
        var code = textBox.val();
        if (code == '' || code == textBox.attr('placeholder')) {
            alert('请输入提取码。')
            return false;
        }

        location.href = flyBox.appUrl + 's.aspx/' + code;
        return false
    })

    $('#search-button').click(function () {
        var key = textBox.val();
        if (key == '' || key == textBox.attr('placeholder')) {
            if (window.allowSearchEmpty) {
                key = '';
            } else {
                alert('请输入搜索关键字（名称、标签）。')
                return false;
            }
        }
        var url = window.searchUrl || (flyBox.appUrl + 'search.aspx?key={0}')
        location.href = url.replace('{0}', key);
        return false
    })
} ();